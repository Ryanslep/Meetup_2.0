const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

router.post('/create', async (req, res) => {
  try {
    // Extract event details from the request body
    const { eventName, date, startTime, endTime, address, capacity, description, host, pictures, tags } = req.body;

    const event = new Event({
      eventName,
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      address,
      capacity,
      description,
      tags,
      host,
      pictures,
      status: 'active',
      rsvps: [],
      interested: [],
    });

    await event.save();
    const user = await User.findById(host);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.events.push(event);
    await user.save();

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event creation failed' });
  }
});

router.delete('/delete/:eventId/:userId', async (req, res) => {
    const { eventId, userId } = req.params;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      if (event.host.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized: You are not the host of this event' });
      }
  
      // Remove the event from the user's events array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const eventIndex = user.events.indexOf(eventId);
      if (eventIndex !== -1) {
        user.events.splice(eventIndex, 1);
      }
  
      // Remove the event from the database
      await Event.findOneAndDelete(event);
      await user.save();
  
      res.json({ message: 'Deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Event deletion failed' });
    }
  });
  
  

//Route for fetching event data
router.get('/fetch', async (req, res) => {
    try{
        const events = await Event.find().populate('host');
        res.json(events);
    }catch (error){
        console.error('Error fetching events:', error);
        res.status(500).json({message: 'Error fetching event data'});
    }
});


// Fetch user event by Id
router.get('/fetch/:eventId', async (req, res) => {
    try{
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate('rsvps');
        res.json(event);
    }catch (error){
        console.error('Error fetching events:', error);
        res.status(500).json({message: 'Error fetching event data'});
    }
});

//Route for deleting event
router.post('/delete-event', async (req, res)=> {
    const eventId = req.body.eventId;

    Event.findByIdAndRemove(eventId, (err, result)=>{
        if(err){
            res.status(500).json({error: 'Could not delete event'});
        } else{
            res.status(200).json({message: 'Event successfully deleted'});
        }
    })
});

// Route for updating event
router.put('/update/:eventId', async (req, res) => {
  const eventId = req.params.eventId; // Use req.params to get the eventId from the URL
  const updatedData = {
    eventName: req.body.eventName,
    date: req.body.date,
    address: req.body.address,
    capacity: req.body.capacity,
    description: req.body.description,
    host: req.body.host,
    recurring: req.body.recurring, // Correct the typo: change 'reacurring' to 'recurring'
  };

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updatedData,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update event' });
  }
});


router.post('/rsvp/:eventId/:userId', async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.params.userId;

  try {
      // Find the event by its ID
      const event = await Event.findOne({ _id: eventId });

      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Check if the user is already in the rsvps array
      const eventRsvpIndex = event.rsvps.findIndex(user => user.toString() === userId);
      const eventInterestedIndex = event.interested.findIndex(user => user.toString() === userId);
      if (eventRsvpIndex !== -1) {
          // If user is already in the RSVP list, remove them
          event.rsvps.splice(eventRsvpIndex, 1);
          res.status(201).json({ message: `You are no longer RSVP\'d for \"${event.eventName}\"`, event });
      } else {
          // If user is not in the RSVP list, add them
          event.rsvps.push(userId);
          res.status(200).json({ message: `You have RSVP\'d for \"${event.eventName}\"`, event });

          // Remove the event from the user's interested array
          const user = await User.findOne({ _id: userId });

          if (user) {
              const interestedIndex = user.interested.findIndex(event => event.toString() === eventId);
              if (interestedIndex !== -1) {
                  // If the event is in the user's interested, remove it
                  user.interested.splice(interestedIndex, 1);
                  event.interested.splice(eventInterestedIndex, 1);
                  await user.save();
              }
          }
      }

      await event.save();

      // Update the user's rsvps array
      const user = await User.findOne({ _id: userId });

      if (user) {
          // Check if the event is already in the user's rsvps array
          const eventIndex = user.rsvps.findIndex(event => event.toString() === eventId);

          if (eventIndex !== -1) {
              // If the event is already in the user's rsvps, remove it
              user.rsvps.splice(eventIndex, 1);
          } else {
              // If the event is not in the user's rsvps, add it
              user.rsvps.push(eventId);
          }

          // Save the updated user
          await user.save();
      }

  } catch (error) {
      console.error('Error adding/removing user to/from RSVPs:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/interested/:eventId/:userId', async (req, res) => {
  const { eventId, userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (user.interested.some(item => item._id.toString() === eventId)) {
    console.log('user already interested in the event');
  
    // Remove the event from the interested list
    user.interested = user.interested.filter(item => item._id.toString() !== eventId);
    event.interested = event.interested.filter(item => item._id.toString() !== userId);
    await user.save(); // Save the user after making changes
    await event.save(); 
    return res.status(200).json({ message: 'Deleted' });
  } else {
    console.log('adding event to user.interested')
    // Add the event to the users interested list and vice versa
    user.interested.push(eventId);
    event.interested.push(userId);
    await user.save(); // Save the user after making changes
    await event.save();
    return res.status(200).json({ message: 'Added' });
  }
});



router.post('/report', async (req, res) => {
    try {
      const { eventId, reportData } = req.body;
  
      // Validate or sanitize the input as needed
  
      // Find the event by ID
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      // Update the event with the report data
      event.reports.push(reportData);
      await event.save();
  
      // Respond with a success message or updated event data
      res.json({ message: 'Event reported successfully', updatedEvent: event });
    } catch (error) {
      console.error('Error reporting event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.get('/:eventId/rsvps', async (req, res) => {
    try {
      const eventId = req.params.eventId;
  
      // Find the event
      const event = await Event.findById(eventId).populate('rsvps');
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }
      res.json(event.rsvps);
    } catch (error) {
      console.error('Error fetching event RSVPs:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  router.get('/:eventId/interested', async (req, res) => {
    try {
      const eventId = req.params.eventId;
  
      // Find the event
      const event = await Event.findById(eventId).populate('interested');
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
      }
      return res.json(event.interested);
    } catch (error) {
      console.error('Error fetching event Intersted:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  router.post('/:eventId/cancel', async (req, res) => {
    try {
      const eventId = req.params.eventId;

      const event = await Event.findById(eventId);
      if(event.status === 'active') {
        console.log('status was active')
        event.status = 'cancelled';
        event.save();
        return res.status(200).json({message: event.status});
      } 
    } catch(error) {
      console.error('Error canceling event')
    }
  });

  router.post('/:eventId/reactivate', async (req, res) => {
    try {
      const eventId = req.params.eventId;

      const event = await Event.findById(eventId);
      if(event.status === 'cancelled') {
        console.log('status was cancelled')
        event.status = 'active';
        event.save();
        return res.status(200).json({message: event.status});
      } 
    } catch(error) {
      console.error('Error canceling event')
    }
  });

module.exports = router;
const Gig = require('../models/Gig');

// Create a Plan
exports.createPlan = async (req, res) => {
  const { id } = req.params; // Gig ID from request params
  const { name, price, deliveryDays, description } = req.body; // Extract plan data from request body

  try {
    // Find the gig to which the plan will be added
    const gig = await Gig.findById(id);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Create the new plan
    const newPlan = {
      name,
      price,
      deliveryDays,
      description,
    };

    // Add the plan to the gig
    gig.plans.push(newPlan);

    // Save the updated gig
    await gig.save();

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Error creating plan' });
  }
};

// Update a Plan
exports.updatePlan = async (req, res) => {
  const { gigId, planId } = req.params; // Gig ID and Plan ID from request params
  const { name, price, deliveryDays, description } = req.body; // Extract new data for plan

  try {
    // Find the gig
    const gig = await Gig.findById(gigId);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Find the plan to update
    const plan = gig.plans.id(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Update plan details
    plan.name = name || plan.name;
    plan.price = price || plan.price;
    plan.deliveryDays = deliveryDays || plan.deliveryDays;
    plan.description = description || plan.description;

    // Save the updated gig
    await gig.save();

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Error updating plan' });
  }
};

// Delete a Plan
exports.deletePlan = async (req, res) => {
  const { gigId, planId } = req.params; // Gig ID and Plan ID from request params

  try {
    // Find the gig
    const gig = await Gig.findById(gigId);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Find the plan to delete
    const plan = gig.plans.id(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Remove the plan
    plan.remove();

    // Save the updated gig
    await gig.save();

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Error deleting plan' });
  }
};

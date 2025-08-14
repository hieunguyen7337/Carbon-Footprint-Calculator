const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Activity = require('../models/Activity');
const { addActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController'); // Import activity controller functions
const { expect } = chai;

chai.use(chaiHttp);

describe('Activity Controller Tests', () => {

  // --- Test Suite for addActivity ---
  describe('addActivity Function Test', () => {

    it('should create a new activity successfully', async () => {
      // Mock request data with a new ObjectId for userId
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          activityType: 'Travel',
          quantity: 100,
          unit: 'km',
          deadline: '2025-12-31'
        }
      };

      // Mock the activity object that Mongoose would return after creation
      const createdActivity = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

      // Stub Activity.create to return the mocked createdActivity
      const createStub = sinon.stub(Activity, 'create').resolves(createdActivity);

      // Mock response object: status and json methods
      const res = {
        status: sinon.stub().returnsThis(), // Allows chaining .status().json()
        json: sinon.spy() // Spy to check if json was called with correct arguments
      };

      // Call the controller function
      await addActivity(req, res);

      // Assertions:
      // 1. Check if Activity.create was called once with the correct payload
      expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
      // 2. Check if response status was set to 201 (Created)
      expect(res.status.calledWith(201)).to.be.true;
      // 3. Check if response json was called with the created activity data
      expect(res.json.calledWith(createdActivity)).to.be.true;

      // Restore the stubbed method to prevent interference with other tests
      createStub.restore();
    });

    it('should return 500 if an error occurs during creation', async () => {
      // Stub Activity.create to throw an error, simulating a DB issue
      const createStub = sinon.stub(Activity, 'create').throws(new Error('Database error during activity creation'));

      // Mock request data
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          activityType: 'Travel',
          quantity: 100,
          unit: 'km',
          deadline: '2025-12-31'
        }
      };

      // Mock response object
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      // Call the controller function
      await addActivity(req, res);

      // Assertions:
      // 1. Check if response status was set to 500 (Internal Server Error)
      expect(res.status.calledWith(500)).to.be.true;
      // 2. Check if response json was called with the error message
      expect(res.json.calledWithMatch({ message: 'Database error during activity creation' })).to.be.true;

      // Restore the stub
      createStub.restore();
    });
  });


});
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
          date: '2025-12-31'
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
          date: '2025-12-31'
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

  // --- Test Suite for getActivities ---
  describe('getActivities Function Test', () => {
    it('should return all activities for the authenticated user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockActivities = [
        { _id: new mongoose.Types.ObjectId(), userId, activityType: 'Travel', quantity: 50, unit: 'km' },
        { _id: new mongoose.Types.ObjectId(), userId, activityType: 'Electricity', quantity: 200, unit: 'kWh' },
      ];

      // Stub Activity.find to return the mock activities
      const findStub = sinon.stub(Activity, 'find').resolves(mockActivities);

      const req = { user: { id: userId } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getActivities(req, res);

      // Assertions
      expect(findStub.calledOnceWith({ userId: req.user.id })).to.be.true;
      expect(res.json.calledWith(mockActivities)).to.be.true;
      expect(res.status.notCalled).to.be.true; // Status not set for success (defaults to 200)

      findStub.restore();
    });

    it('should return 500 if an error occurs during retrieval', async () => {
      // Stub Activity.find to throw an error
      const findStub = sinon.stub(Activity, 'find').throws(new Error('DB connection error'));

      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      await getActivities(req, res);

      // Assertions
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB connection error' })).to.be.true;

      findStub.restore();
    });
  });

});
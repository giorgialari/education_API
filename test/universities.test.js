const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const universitiesController = require('../controllers/universitiesController');
const universitiesModel = require('../models/universitiesModel');

describe('Universities Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  it('should return all universities', async () => {
    const mockData = [{ id: 1, name: 'Test University' }];
    const modelStub = sinon.stub(universitiesModel, 'getAllUniversities').resolves(mockData);
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await universitiesController.getAllUniversities(req, res);

    expect(modelStub.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockData)).to.be.true;
  });

  it('should return a university by id', async () => {
    const mockData = { id: 1, name: 'Test University' };
    const modelStub = sinon.stub(universitiesModel, 'getUniversityById').resolves([mockData]);
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await universitiesController.getUniversityById(req, res);

    expect(modelStub.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith([mockData])).to.be.true;
  });

  it('should create a university', async () => {
    const mockData = { insertId: 1 };
    const modelStub = sinon.stub(universitiesModel, 'createUniversity').resolves(mockData);
    const req = { body: { name: 'New University' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await universitiesController.createUniversity(req, res);

    expect(modelStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(mockData)).to.be.true;
  });

  it('should update a university', async () => {
    const mockData = { id: 1, name: 'Updated University' };
    const modelStubGet = sinon.stub(universitiesModel, 'getUniversityById').resolves([mockData]);
    const modelStubUpdate = sinon.stub(universitiesModel, 'updateUniversity').resolves(true);
    const req = { params: { id: 1 }, body: { name: 'Updated University' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await universitiesController.updateUniversity(req, res);

    expect(modelStubGet.calledOnce).to.be.true;
    expect(modelStubUpdate.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it('should delete a university', async () => {
    const mockData = { id: 1, name: 'University To Delete' };
    const modelStubGet = sinon.stub(universitiesModel, 'getUniversityById').resolves([mockData]);
    const modelStubDelete = sinon.stub(universitiesModel, 'deleteUniversity').resolves(true);
    const req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    await universitiesController.deleteUniversity(req, res);

    expect(modelStubGet.calledOnce).to.be.true;
    expect(modelStubDelete.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });
});

const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const courseTypesModel = require("../models/courseTypesModel");
const courseTypesController = require("../controllers/courseTypesController");

describe("CourseTypes Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getAllCourseTypes", () => {
    it("should return all course types", async () => {
      const mockData = [
        { id: 1, name: "Type 1" },
        { id: 2, name: "Type 2" },
      ];
      const modelStub = sinon.stub(courseTypesModel, "getAllCourseTypes").resolves(mockData);
      const req = {};
      const res = {
        json: sinon.stub(),
      };
      const next = sinon.spy();

      await courseTypesController.getAllCourseTypes(req, res, next);

      expect(modelStub.calledOnce).to.be.true;
      expect(res.json.calledOnceWith(mockData)).to.be.true;
    });

    it("should handle no course types found", async () => {
      const modelStub = sinon.stub(courseTypesModel, "getAllCourseTypes").resolves([]);
      const req = {};
      const res = {};
      const next = sinon.spy();

      await courseTypesController.getAllCourseTypes(req, res, next);

      expect(modelStub.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });

  describe("getCourseTypeById", () => {
    it("should return a course type by id", async () => {
      const mockData = { id: 1, name: "Type 1" };
      const modelStub = sinon.stub(courseTypesModel, "getCourseTypeById").resolves(mockData);
      const req = { params: { id: 1 } };
      const res = {
        json: sinon.stub(),
      };
      const next = sinon.spy();

      await courseTypesController.getCourseTypeById(req, res, next);

      expect(modelStub.calledOnce).to.be.true;
      expect(res.json.calledOnceWith(mockData)).to.be.true;
    });

    it("should handle course type not found", async () => {
      const modelStub = sinon.stub(courseTypesModel, "getCourseTypeById").resolves(null);
      const req = { params: { id: 999 } };
      const res = {};
      const next = sinon.spy();

      await courseTypesController.getCourseTypeById(req, res, next);

      expect(modelStub.calledOnce).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });

  describe("createCourseType", () => {
    it("should create a course type", async () => {
      const mockData = { insertId: 1 };
      const modelStub = sinon.stub(courseTypesModel, "createCourseType").resolves(mockData);
      const req = { body: { name: "New Type" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.spy();

      await courseTypesController.createCourseType(req, res, next);

      expect(modelStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockData)).to.be.true;
    });
  });
});

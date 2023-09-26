// test/coursesController.test.js
const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;
const coursesModel = require("../models/coursesModel");
const coursesController = require("../controllers/courseController");


describe("Courses Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getAllCourses", () => {
    it("should return all courses", async () => {
      const mockCourses = [
        { id: 1, name: "Course 1" },
        { id: 2, name: "Course 2" },
      ];
      sinon.stub(coursesModel, "getAllCourses").resolves(mockCourses);

      const req = {};
      const res = { json: sinon.spy() };
      const next = sinon.spy();

      await coursesController.getAllCourses(req, res, next);

      expect(res.json.calledOnceWith(mockCourses)).to.be.true;
    });

    it("should handle no courses found", async () => {
      sinon.stub(coursesModel, "getAllCourses").resolves([]);

      const req = {};
      const res = {};
      const next = sinon.spy();

      await coursesController.getAllCourses(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });

  describe("getCourseById", () => {
    it("should return the course if it exists", async () => {
      const mockCourse = { id: 1, name: "Course 1" };
      sinon.stub(coursesModel, "getCourseById").resolves(mockCourse);

      const req = { params: { id: 1 } };
      const res = { json: sinon.spy() };
      const next = sinon.spy();

      await coursesController.getCourseById(req, res, next);

      expect(res.json.calledOnceWith(mockCourse)).to.be.true;
    });

    it("should handle course not found", async () => {
      sinon.stub(coursesModel, "getCourseById").resolves(null);

      const req = { params: { id: 999 } };
      const res = {};
      const next = sinon.spy();

      await coursesController.getCourseById(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });

  describe("createCourse", () => {
    it("should create a course", async () => {
      const mockResult = { insertId: 1 };
      sinon.stub(coursesModel, "createCourse").resolves(mockResult);

      const req = { body: { name: "New Course", idType: 1 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();

      await coursesController.createCourse(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith(mockResult)).to.be.true;
    });

  });

  describe("updateCourse", () => {
    it("should update the course if it exists", async () => {
      const mockResult = { affectedRows: 1 };
      sinon.stub(coursesModel, "getCourseById").resolves({ id: 1, name: "Existing Course" });
      sinon.stub(coursesModel, "updateCourse").resolves(mockResult);

      const req = { params: { id: 1 }, body: { name: "Updated Course", idType: 1 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();

      await coursesController.updateCourse(req, res, next);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith(mockResult)).to.be.true;
    });

    it("should handle course not found", async () => {
      sinon.stub(coursesModel, "getCourseById").resolves(null);

      const req = { params: { id: 999 }, body: { name: "Non-Existent Course", idType: 1 } };
      const res = {};
      const next = sinon.spy();

      await coursesController.updateCourse(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });

  describe("deleteCourse", () => {
    it("should delete the course if it exists", async () => {
      const mockResult = { affectedRows: 1 };
      sinon.stub(coursesModel, "getCourseById").resolves({ id: 1, name: "Existing Course" });
      sinon.stub(coursesModel, "deleteCourse").resolves(mockResult);

      const req = { params: { id: 1 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      const next = sinon.spy();

      await coursesController.deleteCourse(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ message: "Course deleted" })).to.be.true;
    });

    it("should handle course not found", async () => {
      sinon.stub(coursesModel, "getCourseById").resolves(null);

      const req = { params: { id: 999 } };
      const res = {};
      const next = sinon.spy();

      await coursesController.deleteCourse(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal("entity.not.found");
    });
  });
});

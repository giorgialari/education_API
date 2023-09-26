const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const courseUniversityModel = require('../models/courseUniversityModel');
const courseUniversityController = require('../controllers/courseUniversityController');

describe('CourseUniversity Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('associateCourseToUniversity', () => {
    it('should associate a course to a university', async () => {
      const mockData = { message: 'Association successful' };
      sinon.stub(courseUniversityModel, 'checkExistingAssociation').resolves(false);
      sinon.stub(courseUniversityModel, 'associateCourseToUniversity').resolves(mockData);
      const req = { body: { course_id: 1, university_id: 1 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.spy();

      await courseUniversityController.associateCourseToUniversity(req, res, next);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(mockData)).to.be.true;
    });

    it('should handle existing association', async () => {
      sinon.stub(courseUniversityModel, 'checkExistingAssociation').resolves(true);
      const req = { body: { course_id: 1, university_id: 1 } };
      const res = {};
      const next = sinon.spy();

      await courseUniversityController.associateCourseToUniversity(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].type).to.equal('entity.already.exists');
    });


  describe('getCoursesAndUniversities', () => {
    it('should get courses and universities', async () => {
      const mockData = [
        { course_name: 'Course 1', university_name: 'Uni 1', course_type: 'Type 1' },
        { course_name: 'Course 2', university_name: 'Uni 2', course_type: 'Type 2' }
      ];
      sinon.stub(courseUniversityModel, 'getCoursesAndUniversities').resolves(mockData);
      const req = { query: { courseName: 'Course', courseType: 'Type' } };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.spy();

      await courseUniversityController.getCoursesAndUniversities(req, res, next);

      expect(res.json.calledOnceWith(mockData)).to.be.true;
    });
    }); 
    });
});

const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

// Mock the database first
const mysql = require("mysql2/promise");
const mockConnection = {
  execute: sinon.stub(),
  release: sinon.stub(),
};
const mockPool = {
  getConnection: sinon.stub().resolves(mockConnection),
};
sinon.stub(mysql, "createPool").returns(mockPool);

const app = require("../app");

describe("GET /courseTypes", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should return all course types", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria" }]]);
    const res = await chai.request(app).get("/courseTypes");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Ingegneria" }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/courseTypes");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe("GET /courseTypes/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should return a single course type", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria" }]]);
    const res = await chai.request(app).get("/courseTypes/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Ingegneria" }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/courseTypes/1");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("POST /courseTypes", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should create a new course type", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria" }]]);
    const res = await chai.request(app).post("/courseTypes").send({ name: "Ingegneria" });
    expect(res.status).to.equal(200);

    expect(mockConnection.execute.calledOnce).to.be.true;
    expect(mockConnection.execute.firstCall.args[0]).to.equal("INSERT INTO courseTypes (name) VALUES (?)");
    expect(mockConnection.execute.firstCall.args[1]).to.deep.equal(["Ingegneria"]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).post("/courseTypes").send({ name: "Ingegneria" });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("GET /courses", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should return all courses", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria del Software", courseTypeId: 1 }]]);
    const res = await chai.request(app).get("/courses");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Ingegneria del Software", courseTypeId: 1 }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/courses");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("GET /courses/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should return a single course", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria del Software", courseTypeId: 1 }]]);
    const res = await chai.request(app).get("/courses/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Ingegneria del Software", courseTypeId: 1 }]);
  });
  
  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/courses/1");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe("POST /courses", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should create a new course", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria del Software", idType: 1 }]]);
    const res = await chai.request(app).post("/courses").send({ name: "Ingegneria del Software", idType: 1 });
    expect(res.status).to.equal(200);

    expect(mockConnection.execute.calledOnce).to.be.true;
    expect(mockConnection.execute.firstCall.args[0]).to.equal("INSERT INTO courses (name, idType) VALUES (?, ?)");
    expect(mockConnection.execute.firstCall.args[1]).to.deep.equal(["Ingegneria del Software", 1]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).post("/courses").send({ name: "Ingegneria del Software", idType: 1 });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("PUT /courses/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should update a single course", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Ingegneria del Software", idType: 1 }]]);
    const res = await chai.request(app).put("/courses/1").send({ name: "Ingegneria del Software", idType: 1 });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Ingegneria del Software", idType: 1 }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).put("/courses/1").send({ name: "Ingegneria del Software", idType: 1 });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('DELETE /courses/:id', function() {

  beforeEach(() => {
    // Resetta lo stato dei mock prima di ogni test
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it('should delete the course and its associations', async function() {
    // Setup
    mockConnection.execute.resolves([{}]); // Vuoto perché simulo un'eliminazione

    // Action
    const res = await chai.request(app).delete('/courses/1');

    // Assertions
    expect(res.status).to.equal(200);
    expect(mockConnection.execute.calledTwice).to.be.true; // Dovrebbe essere chiamato due volte: una per la tabella course_university e una per la tabella courses

    // Verifica la prima query
    expect(mockConnection.execute.firstCall.args[0]).to.equal('DELETE FROM course_university WHERE course_id = ?');
    expect(mockConnection.execute.firstCall.args[1]).to.deep.equal(['1']);

    // Verifica la seconda query
    expect(mockConnection.execute.secondCall.args[0]).to.equal('DELETE FROM courses WHERE id = ?');
    expect(mockConnection.execute.secondCall.args[1]).to.deep.equal(['1']);
  });

  it('should handle database errors', async function() {
    // Setup
    mockConnection.execute.rejects(new Error('Database error'));

    // Action
    const res = await chai.request(app).delete('/courses/1');

    // Assertions
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Database error' });
  });

  afterEach(() => {
    sinon.restore();
  });
});


describe("GET /universities", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });
  it("should return all universities", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).get("/universities");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Politecnico di Milano" }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/universities");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("GET /universities/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it("should return a single university", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).get("/universities/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Politecnico di Milano" }]);
  });
  
  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).get("/universities/1");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe("POST /universities", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it("should create a new university", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).post("/universities").send({ name: "Politecnico di Milano" });
    expect(res.status).to.equal(200);

    expect(mockConnection.execute.calledOnce).to.be.true;
    expect(mockConnection.execute.firstCall.args[0]).to.equal("INSERT INTO universities (name) VALUES (?)");
    expect(mockConnection.execute.firstCall.args[1]).to.deep.equal(["Politecnico di Milano"]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).post("/universities").send({ name: "Politecnico di Milano" });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("PUT /universities/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it("should update a single university", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).put("/universities/1").send({ name: "Politecnico di Milano" });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Politecnico di Milano" }]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).put("/universities/1").send({ name: "Politecnico di Milano" });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe("DELETE /universities/:id", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it("should delete a single university", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).delete("/universities/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([{ id: 1, name: "Politecnico di Milano" }]);
  });
  
  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).delete("/universities/1");
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });

  afterEach(() => {
    sinon.restore();
  });
});

describe("POST /associateCourseToUniversity", function () {
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it("should associate a course to a university", async function () {
    mockConnection.execute.resolves([[{ id: 1, name: "Politecnico di Milano" }]]);
    const res = await chai.request(app).post("/associateCourseToUniversity").send({ course_id: 1, university_id: 1 });
    expect(res.status).to.equal(200);

    expect(mockConnection.execute.calledOnce).to.be.true;
    expect(mockConnection.execute.firstCall.args[0]).to.equal("INSERT INTO course_university (course_id, university_id) VALUES (?, ?)");
    expect(mockConnection.execute.firstCall.args[1]).to.deep.equal([1, 1]);
  });

  it("should handle database errors", async function () {
    mockConnection.execute.rejects(new Error("Database error"));
    const res = await chai.request(app).post("/associateCourseToUniversity").send({ course_id: 1, university_id: 1 });
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: "Database error" });
  });
  afterEach(() => {
    sinon.restore();
  });
});

describe('GET /coursesAndUniversities', function() {

  beforeEach(() => {
    // Reset the mock states before each test
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it('should return all courses and universities', async function() {
    mockConnection.execute.resolves([
      [
        { course_name: 'Ingegneria', university_name: 'Politecnico di Milano' },
        { course_name: 'Matematica', university_name: 'Università di Roma' }
      ]
    ]);

    const res = await chai.request(app).get('/coursesAndUniversities');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { course_name: 'Ingegneria', university_name: 'Politecnico di Milano' },
      { course_name: 'Matematica', university_name: 'Università di Roma' }
    ]);
  });

  it('should handle database errors', async function() {
    mockConnection.execute.rejects(new Error('Database error'));
    const res = await chai.request(app).get('/coursesAndUniversities');

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Database error' });
  });

  afterEach(() => {
    sinon.restore();
  });
});


describe('GET /coursesAndUniversities', function() {
  
  beforeEach(() => {
    mockConnection.execute.resetHistory();
    mockConnection.release.resetHistory();
    mockPool.getConnection.resetHistory();
  });

  it('should return all courses and universities without filters', async function() {
    mockConnection.execute.resolves([
      [
        { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' },
        { course_name: 'Matematica', university_name: 'Università di Roma', course_type: 'Scienze' }
      ]
    ]);
    const res = await chai.request(app).get('/coursesAndUniversities');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' },
      { course_name: 'Matematica', university_name: 'Università di Roma', course_type: 'Scienze' }
    ]);
  });

  it('should filter by courseName', async function() {
    mockConnection.execute.resolves([
      [
        { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' }
      ]
    ]);
    const res = await chai.request(app).get('/coursesAndUniversities?courseName=Ingegneria');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' }
    ]);
  });

  it('should filter by courseType', async function() {
    mockConnection.execute.resolves([
      [
        { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' }
      ]
    ]);
    const res = await chai.request(app).get('/coursesAndUniversities?courseType=Ingegneria');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { course_name: 'Ingegneria', university_name: 'Politecnico di Milano', course_type: 'Ingegneria' }
    ]);
  });

  it('should handle database errors', async function() {
    mockConnection.execute.rejects(new Error('Database error'));
    const res = await chai.request(app).get('/coursesAndUniversities');
    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Database error' });
  });

  afterEach(() => {
    sinon.restore();
  });
});








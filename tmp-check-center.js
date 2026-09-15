require('dotenv').config();
const sequelize = require('./config/database');
const Student = require('./models/Student');
const Center = require('./models/Center');
const Subject = require('./models/Subject');
const setupAssociations = require('./models/associations');
setupAssociations();
(async () => {
  try {
    const cols = Object.keys(await sequelize.getQueryInterface().describeTable('students')).filter(k => /center|subject/i.test(k)).sort();
    const student = await Student.findOne({ include: [Center, Subject] });
    console.log(JSON.stringify({
      tableColumns: cols,
      sample: student && {
        id: student.id,
        name: student.name,
        CenterId: student.CenterId,
        CenterName: student.Center && student.Center.name,
        SubjectId: student.SubjectId,
        SubjectName: student.Subject && student.Subject.name,
      }
    }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

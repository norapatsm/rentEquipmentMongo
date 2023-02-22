const  mongoose  = require("mongoose");

const url = 'mongodb://127.0.0.1:27017/borrowProj';
/**connect mongo */
mongoose.connect(url);

// ตรวจสอบการเชื่อมต่อ
const db = mongoose.connection;
db.once('open', () => {
    console.log('student adaptor connect :', url);
});

db.on('error', (err) => {
    console.error('connection error T_T :', err);
});

const userSchema = new mongoose.Schema({
    username:{ type: String, lowercase: true, trim: true, required: true },
    password:{ type: String, lowercase: true, trim: true, required: true },
    fname:{ type: String, lowercase: true, trim: true, required: true },
    lname:{ type: String, lowercase: true, trim: true, required: true },
    borrowed:{ type:Object, default: {}}
})

module.exports = mongoose.model('users', userSchema);
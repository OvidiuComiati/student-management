module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/StudentAdmin',
    RANDOM_STRING: process.env.JWT_SECRET || 'abc123'
}

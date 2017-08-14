'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const MenuSchema = new mongoose.Schema({
        menuName: String,
        url: { type: String, required: false },
        icon: String,
        is_always_show: Boolean,
        codeId: { type: String, required: false },
        is_join: Boolean,
        parentId: { type: String, required: false },
        create_date: { type: Date, default: Date.now },
        update_date: { type: Date, default: Date.now }
    });
    return mongoose.model('Menu', MenuSchema);
};

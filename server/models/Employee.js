module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
        f_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        f_Image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_Email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,  
            }
        },
        f_Mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_Designation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_Gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_Course: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_CreateDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,  
        }
    });

    return Employee;
};

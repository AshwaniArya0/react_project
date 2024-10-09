module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("Login", {
        f_sno: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        f_userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        f_pwd: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    
    return Login;
};

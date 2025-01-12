class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.name = user.name;
    }
}

export default UserDTO;

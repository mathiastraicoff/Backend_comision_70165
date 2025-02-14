import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

export const generateUser = async () => {
    const password = await bcrypt.hash("coder123", 10);
    return {
        first_name: faker.person.firstName(),  
        last_name: faker.person.lastName(),   
        email: faker.internet.email(),
        phone: faker.phone.number(), 
        age: faker.number.int({ min: 18, max: 80 }), 
        password,
        role: faker.helpers.arrayElement(["user", "admin"]), 
        pets: []
    };
};

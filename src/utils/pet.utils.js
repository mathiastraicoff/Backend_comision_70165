import { faker } from "@faker-js/faker";

export const generatePets = (count) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push({
            name: faker.animal.dog(),
            breed: faker.animal.cat(),
            age: faker.number.int({ min: 1, max: 15 }),
            adopted: false,
            owner: null
        });
    }
    return pets;
};

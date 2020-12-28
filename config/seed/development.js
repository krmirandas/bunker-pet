module.exports.seed = {
  development: [
    /*************  ADMIN   *************/
    {
      model: "admin",
      data: {
        id: 4001,
        email: "kevinmiranda29@ciencias.unam.mx",
        password: "password",
        phone: "+52 5531340063",
        name: "Kevin",
        last_name: "Miranda",
      },
    },
    {
      model: "customer",
      data: {
        id: 4001,
        email: "krmirandas@gmail.com",
        password: "password",
        phone: "+52 5531340063",
        name: "Kevin",
        last_name: "Miranda",
        gender: "male",
      },
    },
    {
      model: "petsitter",
      data: {
        id: 4001,
        email: "kursus29@gmail.com",
        password: "password",
        phone: "+52 5531340063",
        name: "Kevin",
        last_name: "Miranda",
        city: "México",
        validate: true,
      },
    },
    {
      model: "service",
      data: {
        id: 4001,
        petsitter: 4001,
        type: "Paseo",
        price: 200,
      },
    },
    {
      model: "service",
      data: {
        id: 4002,
        petsitter: 4001,
        type: "Hospedaje",
        price: 200,
      },
    },
    {
      model: "service",
      data: {
        id: 4003,
        petsitter: 4001,
        type: "Baño",
        price: 200,
      },
    },
    {
      model: "service",
      data: {
        id: 4004,
        petsitter: 4001,
        type: "Entrenamiento",
        price: 200,
      },
    },
    {
      model: "package",
      data: {
        id: 4004,
        petsitter: 4001,
        type: "Entrenamiento, Hospedaje",
        price: 500,
      },
    },
    {
      model: "package",
      data: {
        id: 4005,
        petsitter: 4001,
        type: "Entrenamiento, Baño",
        price: 300,
      },
    },
    {
      model: "petsitter",
      data: {
        id: 4002,
        email: "victor@gmail.com",
        password: "password",
        phone: "+52 5531340063",
        name: "Victor",
        last_name: "Molina",
        city: "México",
        validate: true,
      },
    },
  ],
};

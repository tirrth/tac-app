const config = {
  screens: {
    Profile: {
      path: 'profile/:id',
      parse: {
        id: (id) => `${id}`,
      },
    },
  },
};

const linking = {
  prefixes: ['https://tacconnect.in'],
  config,
};

export default linking;

const axios = require('axios');

async function test() {
  try {
    const signupRes = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test',
      email: 'test' + Date.now() + '@test.com',
      password: 'password',
      handle: 'test' + Date.now()
    });
    const token = signupRes.data.token;
    console.log('Got token:', token);

    const generateRes = await axios.post('http://localhost:5000/api/recipes/generate-recipes', {
      ingredients: ['chicken'],
      craving: '',
      location: 'Global'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Generate successful:', generateRes.data.length, 'recipes');
  } catch (error) {
    console.error('Error occurred:', error.response ? error.response.data : error.message);
  }
}

test();

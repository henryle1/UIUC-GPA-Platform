// // Login function
// export const login = async (username, password) => {
//   try {
//     const response = await fetch('http://localhost:5000/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     if (response.status === 401) {
//       const data = await response.json();
//       throw new Error(data.message);
//     } else if (!response.ok) {
//       throw new Error('Login failed');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Login error:', error);
//     throw error;
//   }
// };
  
// // Signup function
//   export const signup = async (username, email, password) => {
//     try {
//       const response = await fetch('http://localhost:5000/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, email, password }),
//       });
//       if (response.status === 409) {
//         throw new Error('Username already exists');
//       } else if (!response.ok) {
//         throw new Error('Signup failed');
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

// ----------------------------------------------------------------------------

// Login function
export const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 401) {
      const data = await response.json();
      throw new Error(data.message);
    } else if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Signup function
export const signup = async (username, email, password) => {
  try {
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.status === 409) {
      throw new Error('Username already exists');
    } else if (!response.ok) {
      throw new Error('Signup failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
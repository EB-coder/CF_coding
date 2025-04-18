const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Переключение между формами
// registerBtn.addEventListener('click', () => {
//     container.classList.add('active');
// });

// loginBtn.addEventListener('click', () => {
//     container.classList.remove('active');
// });

// Переключение форм + смена фона
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    document.body.classList.add('register-bg');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    document.body.classList.remove('register-bg');
});

// Функция проверки email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
// Обработка формы входа по email
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Начало обработки входа');
    
    const email = document.querySelector('.login input[type="text"]').value; // Получаем email
    const password = document.querySelector('.login input[type="password"]').value;

     // Клиентская проверка email
    if (!isValidEmail(email)) {
      alert('Пожалуйста, введите корректный email');
      return;
    }

    try {
        console.log('Отправка запроса на вход для email:', email);
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                username: email, // Отправляем email как username (для совместимости)
                password 
            }),
            credentials: 'include'
        });

        console.log('Статус ответа:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }

        const data = await response.json();
        console.log('Ответ сервера:', data);
        
        if (data.success) {
        console.log('Успешный вход, данные пользователя:', data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token || '');

            if (data.user.isAdmin) {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/profile.html';
            }
        } else {
            alert(data.error || 'Ошибка входа');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert(error.message || 'Неверный email или пароль');
    }
});

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Начало обработки регистрации');
    
    const username = document.querySelector('.register input[type="text"]').value;
    const email = document.querySelector('.register input[type="email"]').value;
    const password = document.querySelector('.register input[type="password"]').value;
    
    // Проверка email при регистрации
    if (!isValidEmail(email)) {
      alert('Пожалуйста, введите корректный email');
      return;
    }
    
    try {
        console.log('Отправка запроса на регистрацию для email:', email);
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }

        const data = await response.json();
        console.log('Ответ сервера:', data);
        
        if (data.success) {
            alert('Регистрация успешна! Теперь войдите.');
            container.classList.remove('active');
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        alert(error.message || 'Пользователь с таким email уже существует');
    }
});
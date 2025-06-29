import React, { useState, useEffect } from 'react';

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('pickup');
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const products = [
    {
      id: 1,
      name: 'Медовый торт',
      price: 1200,
      image: 'https://images.pexels.com/photos/5477636/pexels-photo-5477636.jpeg',
      description: 'Нежный медовый торт с кремом'
    },
    {
      id: 2,
      name: 'Домашний хлеб',
      price: 150,
      image: 'https://images.pexels.com/photos/8858693/pexels-photo-8858693.jpeg',
      description: 'Свежий хлеб на закваске'
    },
    {
      id: 3,
      name: 'Шоколадное печенье',
      price: 300,
      image: 'https://images.unsplash.com/photo-1583936899884-5f20a9570ff9',
      description: 'Хрустящее печенье с шоколадом'
    },
    {
      id: 4,
      name: 'Пирожки с яблоком',
      price: 80,
      image: 'https://images.pexels.com/photos/28749709/pexels-photo-28749709.jpeg',
      description: 'Ароматные пирожки с яблочной начинкой'
    },
    {
      id: 5,
      name: 'Творожный пирог',
      price: 800,
      image: 'https://images.pexels.com/photos/28749710/pexels-photo-28749710.jpeg',
      description: 'Нежный пирог с творожной начинкой'
    },
    {
      id: 6,
      name: 'Булочки с маком',
      price: 70,
      image: 'https://images.unsplash.com/photo-1629836472253-577cb69025bf',
      description: 'Мягкие булочки с маковой начинкой'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Анна Петрова',
      rating: 5,
      text: 'Невероятно вкусная выпечка! Медовый торт просто тает во рту. Заказываем постоянно.',
      image: 'https://images.unsplash.com/photo-1713919934032-e7fb2f3c0af4'
    },
    {
      id: 2,
      name: 'Михаил Сидоров',
      rating: 5,
      text: 'Лучший домашний хлеб в городе! Свежий, ароматный, как у бабушки.',
      image: 'https://images.unsplash.com/photo-1659352155145-e096c84ffb6b'
    },
    {
      id: 3,
      name: 'Елена Козлова',
      rating: 5,
      text: 'Заказывала торт на день рождения - все были в восторге! Спасибо за качество!',
      image: 'https://images.unsplash.com/photo-1713919934032-e7fb2f3c0af4'
    }
  ];

  const deliveryOptions = [
    { id: 'pickup', name: 'Самовывоз', price: 0, description: 'Бесплатно' },
    { id: 'city', name: 'Доставка по городу', price: 200, description: 'В течение 2 часов' },
    { id: 'region', name: 'Доставка за город', price: 500, description: 'В течение дня' }
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    const productTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryPrice = deliveryOptions.find(option => option.id === selectedDelivery)?.price || 0;
    return productTotal + deliveryPrice;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    if (!orderForm.name || !orderForm.phone) {
      alert('Пожалуйста, заполните обязательные поля!');
      return;
    }
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
    setCart([]);
    setOrderForm({ name: '', phone: '', address: '' });
    setIsCartOpen(false);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">🥖</span>
              </div>
              <h1 className="text-2xl font-bold text-orange-800">Домашняя Выпечка</h1>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Корзина ({getTotalItems()})
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1556745750-68295fefafc5')` }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Домашняя выпечка
            <span className="block text-4xl md:text-5xl text-orange-300">с любовью</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Свежая выпечка каждый день. Рецепты передаются из поколения в поколение.
          </p>
          <button 
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-12 py-4 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Посмотреть меню
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
              Наша фирменная выпечка
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Каждое изделие готовится с особой заботой из натуральных ингредиентов
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-orange-600">{product.price}₽</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gradient-to-r from-orange-100 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-xl text-gray-600">
              Что говорят о нас наши покупатели
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{review.name}</h4>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
              Оформить заказ
            </h2>
            <p className="text-xl text-gray-600">
              Заполните форму и мы свяжемся с вами для подтверждения
            </p>
          </div>
          
          <form onSubmit={handleOrderSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="+7 (999) 999-99-99"
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Адрес доставки
              </label>
              <input
                type="text"
                value={orderForm.address}
                onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-colors"
                placeholder="Улица, дом, квартира"
              />
            </div>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Способ доставки
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryOptions.map(option => (
                  <label key={option.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={selectedDelivery === option.id}
                      onChange={(e) => setSelectedDelivery(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDelivery === option.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}>
                      <div className="font-semibold text-gray-800">{option.name}</div>
                      <div className="text-orange-600 font-bold">{option.price === 0 ? 'Бесплатно' : `${option.price}₽`}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Оформить заказ
            </button>
          </form>
        </div>
      </section>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Корзина</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Корзина пуста</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-orange-600 font-bold">{item.price}₽</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Общая сумма:</span>
                      <span className="text-orange-600">{getTotalPrice()}₽</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        document.getElementById('order-form') && document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Оформить заказ
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-800 to-amber-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🥖</span>
                </div>
                <h3 className="text-xl font-bold">Домашняя Выпечка</h3>
              </div>
              <p className="text-orange-100">
                Свежая выпечка с 2010 года. Традиционные рецепты и натуральные ингредиенты.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-orange-100">
                <p>📞 +7 (999) 123-45-67</p>
                <p>📧 info@homebaking.ru</p>
                <p>📍 ул. Пекарская, 123</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Режим работы</h4>
              <div className="space-y-2 text-orange-100">
                <p>Пн-Пт: 8:00 - 20:00</p>
                <p>Сб-Вс: 9:00 - 18:00</p>
                <p>Доставка до 22:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-200">
            <p>&copy; 2025 Домашняя Выпечка. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
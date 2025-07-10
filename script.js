document.addEventListener('DOMContentLoaded', function() {
  const movies = [
    {
      title: 'Naruto',
      image: 'img/naruto.png',
      episodes: Array.from({length: 10}, (_, i) => ({
        title: `Episode ${i+1}`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }))
    },
    {
      title: 'One Piece',
      image: 'img/onepiece.png',
      episodes: Array.from({length: 10}, (_, i) => ({
        title: `Episode ${i+1}`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }))
    },
    {
      title: 'Demon Slayer',
      image: 'img/demonslayer.png',
      episodes: Array.from({length: 10}, (_, i) => ({
        title: `Episode ${i+1}`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }))
    },
    {
      title: 'Dragon Ball',
      image: 'img/dragonball.png',
      episodes: Array.from({length: 10}, (_, i) => ({
        title: `Episode ${i+1}`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }))
    },
    {
      title: 'Hunter x Hunter',
      image: 'img/hunterxhunter.png',
      episodes: Array.from({length: 10}, (_, i) => ({
        title: `Episode ${i+1}`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4'
      }))
    }
  ];

  // Booking System Variables
  let selectedSeats = [];
  let bookedSeats = [];
  let currentBooking = null;
  let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  const gallery = document.getElementById('movieGallery');
  const searchInput = document.getElementById('searchInput');

  function renderMovies(filter = '') {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );
    gallery.innerHTML = filtered.length ? filtered.map((movie, idx) => `
      <div class="movie-card" data-idx="${idx}">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="movie-title">${movie.title}</div>
        <button class="book-btn" onclick="openBookingModal(${idx})">Book Seats</button>
      </div>
    `).join('') : '<div style="color:#fff;grid-column:1/-1;text-align:center;">No results found.</div>';
    
    // Add click listeners for episodes
    document.querySelectorAll('.movie-card').forEach(card => {
      card.onclick = function(e) {
        if (!e.target.classList.contains('book-btn')) {
          const idx = this.getAttribute('data-idx');
          openEpisodesModal(movies[idx]);
        }
      };
    });
  }

  searchInput.addEventListener('input', e => {
    renderMovies(e.target.value);
  });

  renderMovies();

  // --- Episodes Modal ---
  // Create modal elements
  let episodesModal = document.createElement('div');
  episodesModal.id = 'episodesModal';
  episodesModal.className = 'modal';
  episodesModal.innerHTML = `
    <div class="modal-content episodes-modal-content">
      <span class="close" id="closeEpisodesModal">&times;</span>
      <h2 id="episodesTitle"></h2>
      <ul id="episodesList"></ul>
      <div id="videoPlayerContainer" style="display:none;">
        <video id="videoPlayer" width="100%" height="320" controls></video>
      </div>
    </div>
  `;
  document.body.appendChild(episodesModal);

  function openEpisodesModal(movie) {
    document.getElementById('episodesTitle').textContent = movie.title + ' - Episodes';
    const list = document.getElementById('episodesList');
    list.innerHTML = movie.episodes.map((ep, i) => `<li><a href="#" data-vid="${ep.video}" class="episode-link">${ep.title}</a></li>`).join('');
    document.getElementById('videoPlayerContainer').style.display = 'none';
    document.getElementById('videoPlayer').pause();
    episodesModal.style.display = 'block';
    // Add episode click listeners
    document.querySelectorAll('.episode-link').forEach(link => {
      link.onclick = function(e) {
        e.preventDefault();
        const videoUrl = this.getAttribute('data-vid');
        const player = document.getElementById('videoPlayer');
        player.src = videoUrl;
        document.getElementById('videoPlayerContainer').style.display = 'block';
        player.play();
      };
    });
  }
  document.getElementById('closeEpisodesModal').onclick = function() {
    episodesModal.style.display = 'none';
    document.getElementById('videoPlayer').pause();
  };
  window.addEventListener('click', function(event) {
    if (event.target === episodesModal) {
      episodesModal.style.display = 'none';
      document.getElementById('videoPlayer').pause();
    }
  });

  // --- Login modal logic (unchanged) ---
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginBtn.onclick = () => {
    loginModal.style.display = 'block';
    loginError.textContent = '';
  };
  closeModal.onclick = () => {
    loginModal.style.display = 'none';
  };
  window.onclick = (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  };

  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'user' && password === 'password') {
      loginModal.style.display = 'none';
      alert('Login successful!');
    } else {
      loginError.textContent = 'Invalid username or password.';
    }
  };

  // --- Booking System Functions ---
  
  // Calculate seat price based on position
  function getSeatPrice(seatNumber) {
    if (seatNumber <= 5) return 5; // First 5 seats: $5
    if (seatNumber <= 10) return 4; // Second 5 seats: $4
    return 3; // Last 5 seats: $3
  }

  // Generate seats grid
  function generateSeatsGrid() {
    const seatsGrid = document.getElementById('seatsGrid');
    seatsGrid.innerHTML = '';
    
    for (let i = 1; i <= 15; i++) {
      const seat = document.createElement('div');
      seat.className = 'seat available';
      seat.textContent = i;
      seat.dataset.seatNumber = i;
      
      // Check if seat is already booked for the selected date and movie
      const isBooked = bookedSeats.some(booking => 
        booking.seatNumber === i && 
        booking.movie === document.getElementById('movieSelect').value &&
        booking.date === document.getElementById('bookingDate').value
      );
      
      if (isBooked) {
        seat.className = 'seat booked';
      } else if (selectedSeats.includes(i)) {
        seat.className = 'seat selected';
      }
      
      seat.onclick = function() {
        if (!this.classList.contains('booked')) {
          toggleSeatSelection(i);
        }
      };
      
      seatsGrid.appendChild(seat);
    }
  }

  // Toggle seat selection
  function toggleSeatSelection(seatNumber) {
    const index = selectedSeats.indexOf(seatNumber);
    if (index > -1) {
      selectedSeats.splice(index, 1);
    } else {
      selectedSeats.push(seatNumber);
    }
    generateSeatsGrid();
    updateOrderSummary();
  }

  // Update order summary
  function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const totalPrice = document.getElementById('totalPrice');
    
    if (selectedSeats.length === 0) {
      orderSummary.innerHTML = '<p>No seats selected</p>';
      totalPrice.textContent = 'Total: $0';
      return;
    }
    
    const seatDetails = selectedSeats.map(seat => {
      const price = getSeatPrice(seat);
      return `Seat ${seat}: $${price}`;
    }).join('<br>');
    
    const total = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
    
    orderSummary.innerHTML = seatDetails;
    totalPrice.textContent = `Total: $${total}`;
    
    // Enable/disable buttons based on selection
    const hasSelection = selectedSeats.length > 0;
    document.getElementById('updateBooking').disabled = !hasSelection;
    document.getElementById('deleteBooking').disabled = !hasSelection;
    document.getElementById('submitBooking').disabled = !hasSelection;
  }

  // Open booking modal
  window.openBookingModal = function(movieIndex) {
    const movie = movies[movieIndex];
    document.getElementById('bookingTitle').textContent = `Book Seats - ${movie.title}`;
    
    // Populate movie select
    const movieSelect = document.getElementById('movieSelect');
    movieSelect.innerHTML = '<option value="">Choose a movie...</option>';
    movies.forEach((m, idx) => {
      const option = document.createElement('option');
      option.value = m.title;
      option.textContent = m.title;
      if (idx === movieIndex) {
        option.selected = true;
      }
      movieSelect.appendChild(option);
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;
    
    // Reset selections
    selectedSeats = [];
    currentBooking = null;
    
    // Load booked seats for the selected date
    loadBookedSeats();
    
    // Generate seats grid
    generateSeatsGrid();
    updateOrderSummary();
    
    // Show modal
    document.getElementById('bookingModal').style.display = 'block';
  };

  // Load booked seats for selected date and movie
  function loadBookedSeats() {
    const selectedMovie = document.getElementById('movieSelect').value;
    const selectedDate = document.getElementById('bookingDate').value;
    
    if (selectedMovie && selectedDate) {
      bookedSeats = bookings.filter(booking => 
        booking.movie === selectedMovie && booking.date === selectedDate
      );
    } else {
      bookedSeats = [];
    }
  }

  // Update booking
  document.getElementById('updateBooking').onclick = function() {
    if (selectedSeats.length === 0) return;
    
    const movie = document.getElementById('movieSelect').value;
    const date = document.getElementById('bookingDate').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPhone = document.getElementById('userPhone').value;
    
    if (!movie || !date || !userName || !userEmail || !userPhone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Remove existing booking if updating
    if (currentBooking) {
      bookings = bookings.filter(b => b.id !== currentBooking.id);
    }
    
    // Create new booking
    const booking = {
      id: currentBooking ? currentBooking.id : Date.now(),
      movie,
      date,
      seats: selectedSeats,
      userName,
      userEmail,
      userPhone,
      totalPrice: selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    currentBooking = booking;
    alert('Booking updated successfully!');
  };

  // Delete booking
  document.getElementById('deleteBooking').onclick = function() {
    if (!currentBooking) return;
    
    if (confirm('Are you sure you want to delete this booking?')) {
      bookings = bookings.filter(b => b.id !== currentBooking.id);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Remove from booked seats
      bookedSeats = bookedSeats.filter(b => b.id !== currentBooking.id);
      
      currentBooking = null;
      selectedSeats = [];
      generateSeatsGrid();
      updateOrderSummary();
      
      alert('Booking deleted successfully!');
    }
  };

  const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbx5_sw12lZ1sPq2zWUUb54uGv_dGbsf-PQkzyuEljqn8eRvf9QKrWAj8FvB4iJjKQyD/exec';

  // Submit booking and show QR code
  document.getElementById('submitBooking').onclick = function() {
    if (selectedSeats.length === 0) return;
    
    const movie = document.getElementById('movieSelect').value;
    const date = document.getElementById('bookingDate').value;
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPhone = document.getElementById('userPhone').value;
    
    if (!movie || !date || !userName || !userEmail || !userPhone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create booking
    const booking = {
      id: Date.now(),
      movie,
      date,
      seats: selectedSeats,
      userName,
      userEmail,
      userPhone,
      totalPrice: selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Send booking data to Google Sheet
    fetch(SHEET_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        userName,
        userEmail,
        userPhone,
        movie,
        date,
        seats: selectedSeats,
        totalPrice: selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Show QR code for payment
    showQRCode(booking);
  };

  // Show QR code for payment
  function showQRCode(booking) {
    const qrModal = document.getElementById('qrModal');
    const qrCode = document.getElementById('qrCode');
    const paymentSummary = document.getElementById('paymentSummary');
    
    // Use your QR code image
    const qrCodeLink = "https://pay.ababank.com/QSXkHf6SxUrwxgv69";
    
    // Display your QR code image with clickable link
    qrCode.innerHTML = `
      <a href="${qrCodeLink}" target="_blank" style="text-decoration: none;">
        <div style="position: relative; display: inline-block;">
          <img src="${qrCodeLink}" alt="Payment QR Code" style="width: 200px; height: 200px; object-fit: contain;">
        </div>
      </a>
    `;
    
    paymentSummary.innerHTML = `
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Movie:</strong> ${booking.movie}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Seats:</strong> ${booking.seats.join(', ')}</p>
      <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
      <p><strong>Customer:</strong> ${booking.userName}</p>
    `;
    
    qrModal.style.display = 'block';
  }

  // Close booking modal
  document.getElementById('closeBookingModal').onclick = function() {
    document.getElementById('bookingModal').style.display = 'none';
  };

  // Close QR modal
  document.getElementById('closeQrModal').onclick = function() {
    document.getElementById('qrModal').style.display = 'none';
  };

  // Payment confirmation functionality
  document.getElementById('paymentDoneBtn').onclick = function() {
    // Hide QR modal
    document.getElementById('qrModal').style.display = 'none';
    // Show payment confirmation modal
    document.getElementById('paymentConfirmModal').style.display = 'block';
  };

  // Close payment confirmation modal
  document.getElementById('closeConfirmModal').onclick = function() {
    document.getElementById('paymentConfirmModal').style.display = 'none';
    // Reset booking form
    selectedSeats = [];
    currentBooking = null;
    document.getElementById('bookingModal').style.display = 'none';
    // Refresh the page or redirect to home
    window.location.reload();
  };

  // Event listeners for booking form
  document.getElementById('movieSelect').addEventListener('change', function() {
    loadBookedSeats();
    generateSeatsGrid();
  });

  document.getElementById('bookingDate').addEventListener('change', function() {
    loadBookedSeats();
    generateSeatsGrid();
  });

  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('bookingModal')) {
      document.getElementById('bookingModal').style.display = 'none';
    }
    if (event.target === document.getElementById('qrModal')) {
      document.getElementById('qrModal').style.display = 'none';
    }
    if (event.target === document.getElementById('paymentConfirmModal')) {
      document.getElementById('paymentConfirmModal').style.display = 'none';
    }
  });
}); 
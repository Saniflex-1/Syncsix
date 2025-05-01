// PetroLogix - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a, .footer-links a, .cta-button');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav links
        document.querySelectorAll('nav a').forEach(link => {
          link.classList.remove('active');
        });
        
        // Add active class to clicked nav link (only header nav)
        if (this.parentElement.parentElement.tagName === 'NAV') {
          this.classList.add('active');
        }
        
        // Set corresponding header nav link as active
        const targetId = this.getAttribute('data-target');
        document.querySelector(`nav a[data-target="${targetId}"]`).classList.add('active');
        
        // Hide all sections
        sections.forEach(section => {
          section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(targetId).classList.add('active');
        
        // Smooth scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
    
    // Initialize map
  if (document.getElementById('map')) {
      // console.log(document.getElementById('map'))
      initMap();
    }
    
    // Contact form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const name = this.querySelector('[name="name"]').value.trim();
        const email = this.querySelector('[name="email"]').value.trim();
        const message = this.querySelector('[name="message"]').value.trim();
        
        if (!name || !email || !message) {
          alert('Please fill in all fields');
          return;
        }
        
        if (!isValidEmail(email)) {
          alert('Please enter a valid email address');
          return;
        }
        
        // Form submission success (simulate API call)
        alert('Thank you! Your message has been sent successfully.');
        this.reset();
      });
    }
  });
  // document.addEventListener('DOMContentLoaded', function () {
  //   initMap();
  // });
  
  // Map initialization function
  function initMap() {
    // Create the map instance
    const map = L.map('map');
  
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Facility data
    const facilities = [
      { name: 'Tema Oil Refinery', location: [5.6744, -0.0175], type: 'refinery' },
      { name: 'Accra Distribution Center', location: [5.6037, -0.1870], type: 'depot' },
      { name: 'Kumasi Distribution Hub', location: [6.6885, -1.6244], type: 'depot' },
      { name: 'Takoradi Port Storage', location: [4.9126, -1.7818], type: 'port' },
      { name: 'Tamale Distribution Point', location: [9.4075, -0.8533], type: 'depot' }
    ];
  
    // Dynamic marker styles
    function getMarkerIcon(type) {
      const colors = {
        refinery: '#ff4500',
        depot: '#0052cc',
        port: '#28a745',
        default: '#ffa500'
      };
      const color = colors[type] || colors.default;
  
      return L.divIcon({
        html: `<div style="background-color:${color}; width:15px; height:15px; border-radius:50%; border:2px solid white;"></div>`,
        className: 'custom-marker',
        iconSize: [15, 15]
      });
    }
  
    // Add facility markers
    facilities.forEach(facility => {
      L.marker(facility.location, { icon: getMarkerIcon(facility.type) })
        .addTo(map)
        .bindPopup(`<strong>${facility.name}</strong><br>Type: ${facility.type}`);
    });
  
    // Routes definition
    const routes = [
      {
        from: 'Tema Oil Refinery',
        to: 'Accra Distribution Center',
        coords: [[5.6744, -0.0175], [5.6037, -0.1870]],
        color: '#0052cc'
      },
      {
        from: 'Accra Distribution Center',
        to: 'Kumasi Distribution Hub',
        coords: [[5.6037, -0.1870], [6.6885, -1.6244]],
        color: '#ffa500'
      },
      {
        from: 'Takoradi Port Storage',
        to: 'Kumasi Distribution Hub',
        coords: [[4.9126, -1.7818], [6.6885, -1.6244]],
        color: '#28a745'
      },
      {
        from: 'Kumasi Distribution Hub',
        to: 'Tamale Distribution Point',
        coords: [[6.6885, -1.6244], [9.4075, -0.8533]],
        color: '#ff4500'
      }
    ];
  
    // Draw polylines for each route
    routes.forEach(route => {
      L.polyline(route.coords, { color: route.color, weight: 4 })
        .addTo(map)
        .bindPopup(`Route: ${route.from} to ${route.to}`);
    });
  
    // Simulated moving vehicles
    const vehicles = [
      {
        id: 'TK-1234',
        route: [[5.6744, -0.0175], [5.6500, -0.0600], [5.6300, -0.1000], [5.6037, -0.1870]],
        position: 0
      },
      {
        id: 'TK-5678',
        route: [[4.9126, -1.7818], [5.5000, -1.5000], [6.2000, -1.5500], [6.6885, -1.6244]],
        position: 0
      }
    ];
  
    const truckIcon = L.divIcon({
      html: '<div style="background-color:#ff7700; width:10px; height:10px; border-radius:50%; border:2px solid white;"></div>',
      className: 'truck-marker',
      iconSize: [10, 10]
    });
  
    const vehicleMarkers = vehicles.map(vehicle => ({
      vehicle: vehicle,
      marker: L.marker(vehicle.route[0], { icon: truckIcon })
        .addTo(map)
        .bindPopup(`Truck ID: ${vehicle.id}`)
    }));
  
    // Animate vehicle movement
    setInterval(() => {
      vehicleMarkers.forEach(item => {
        item.vehicle.position = (item.vehicle.position + 1) % item.vehicle.route.length;
        const nextPosition = item.vehicle.route[item.vehicle.position];
        item.marker.setLatLng(nextPosition);
      });
    }, 800); // Slightly slower for visibility
    
  
    // Fit map to show all features
    const allCoords = [
      ...facilities.map(f => f.location),
      ...routes.flatMap(r => r.coords),
      ...vehicles.flatMap(v => v.route)
    ];
  
    map.fitBounds(L.latLngBounds(allCoords));
  }
  
  
  // EmailJS Integration for Syncsix Contact Form

document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS with your public key
  // Replace "YOUR_PUBLIC_KEY" with your actual EmailJS public key
  emailjs.init("tTRvJwVTDd1suTUHJ");
  
  // Contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading indication
      const submitButton = this.querySelector('.submit-button');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Simple form validation
      const name = this.querySelector('[name="name"]').value.trim();
      const email = this.querySelector('[name="email"]').value.trim();
      const message = this.querySelector('[name="message"]').value.trim();
      
      if (!name || !email || !message) {
        alert('Please fill in all fields');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
      }
      
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
      }
      
      // Prepare EmailJS parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };
      
      // Send email using EmailJS
      // Replace "YOUR_SERVICE_ID" and "YOUR_TEMPLATE_ID" with your actual EmailJS service and template IDs
      emailjs.send("service_myq8g5m","template_qbgfjgc", templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          alert('Thank you! Your message has been sent successfully.');
          contactForm.reset();
        }, function(error) {
          console.log('FAILED...', error);
          alert('Failed to send message. Please try again later.');
        })
        .finally(function() {
          // Reset button state
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }
});

// Email validation utility
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
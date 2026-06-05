// Dynamic Copyright Year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Navigation functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');

// Intersection Observer for skill bars
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = progress + '%';
        }
    });
}, observerOptions);

skillBars.forEach(bar => {
    observer.observe(bar);
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add animation on scroll for sections
const observerOptionsFade = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptionsFade);

// Observe about content and contact info
const animatedElements = document.querySelectorAll('.about-text, .contact-info');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// ============================================================
// GitHub Projects — Fetch ALL repos (paginated)
// ============================================================
const GITHUB_USERNAME = 'jalalakbar47';

// Fetch all pages of repos from GitHub API
async function fetchAllGitHubRepos() {
    let allRepos = [];
    let page = 1;
    const perPage = 100; // max allowed by GitHub API

    try {
        while (true) {
            const response = await fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=${perPage}&page=${page}`
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('GitHub API error:', errorData.message || response.statusText);
                break;
            }

            const repos = await response.json();
            if (!Array.isArray(repos) || repos.length === 0) break;

            allRepos = allRepos.concat(repos);

            // If we got fewer than perPage, we've reached the last page
            if (repos.length < perPage) break;
            page++;
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }

    return allRepos;
}

async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingEl = document.getElementById('projectsLoading');
    const projectsCountEl = document.getElementById('projectsCount');
    const scrollWrapper = document.getElementById('projectsScrollWrapper');
    const scrollTopBtn = document.getElementById('projectsScrollTop');
    const projectsFade = document.getElementById('projectsFade');

    const allRepos = await fetchAllGitHubRepos();

    // Filter out forks, keep original repos only
    const originalRepos = allRepos.filter(repo => !repo.fork);

    // Remove loading spinner
    if (loadingEl) loadingEl.remove();

    if (originalRepos.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align:center;color:var(--text-secondary);grid-column:1/-1;">No projects found.</p>';
        if (projectsCountEl) projectsCountEl.textContent = '0 projects found';
        return;
    }

    if (projectsCountEl) {
        projectsCountEl.textContent = `Showing ${originalRepos.length} projects from GitHub`;
    }

    displayProjects(originalRepos);

    // Internal scroll controls
    scrollWrapper.addEventListener('scroll', () => {
        // Show/hide scroll to top button
        if (scrollWrapper.scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Hide fade if at bottom
        const scrollBottom = scrollWrapper.scrollHeight - scrollWrapper.clientHeight - scrollWrapper.scrollTop;
        if (scrollBottom < 20) {
            projectsFade.style.opacity = '0';
        } else {
            projectsFade.style.opacity = '1';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        scrollWrapper.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Language color mapping
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f7df1e',
        'TypeScript': '#3178c6',
        'Python': '#3776ab',
        'Java': '#ed8b00',
        'Kotlin': '#A97BFF',
        'Dart': '#00B4AB',
        'React': '#61dafb',
        'HTML': '#e34c26',
        'CSS': '#1572b6',
        'Vue': '#4fc08d',
        'Node.js': '#339933',
        'PHP': '#777bb4',
        'Ruby': '#cc342d',
        'Go': '#00add8',
        'C++': '#f34b7d',
        'C#': '#178600',
        'Shell': '#89e051',
        'Swift': '#F05138'
    };
    return colors[language] || '#6366f1';
}

// Gradient palette for project cards
const gradientColors = [
    ['#6366f1', '#8b5cf6'],
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
    ['#a8edea', '#fed6e3'],
    ['#f77062', '#fe5196'],
    ['#c471f5', '#fa71cd'],
    ['#48c6ef', '#6f86d6'],
    ['#feada6', '#f5efef']
];

function displayProjects(repos) {
    const projectsGrid = document.getElementById('projectsGrid');

    repos.forEach((repo, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const language = repo.language || 'Code';
        const languageColor = getLanguageColor(language);
        const gradient = gradientColors[index % gradientColors.length];

        // Format project name
        const projectName = repo.name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());

        // Stars badge
        const starsBadge = repo.stargazers_count > 0
            ? `<span>⭐ ${repo.stargazers_count}</span>`
            : '';

        // Forks badge
        const forksBadge = repo.forks_count > 0
            ? `<span>🍴 ${repo.forks_count}</span>`
            : '';

        // Updated date
        const updatedDate = repo.updated_at
            ? `<span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>`
            : '';

        projectCard.innerHTML = `
            <div class="project-image">
                <div class="project-image-placeholder" style="background: linear-gradient(135deg, ${gradient[0]}, ${gradient[1]});">
                    <div class="project-image-content">
                        <i class="fab fa-github" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.9;"></i>
                        <h4 style="color: white; font-size: 1rem; font-weight: 600; text-align: center; padding: 0 0.75rem;">${projectName}</h4>
                        ${language ? `<span style="background: rgba(255,255,255,0.2); color: white; padding: 0.2rem 0.6rem; border-radius: 15px; margin-top: 0.35rem; font-size: 0.7rem;">${language}</span>` : ''}
                    </div>
                </div>
                <div class="project-overlay">
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    <a href="${repo.html_url}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>
                </div>
            </div>
            <div class="project-content">
                <h3>${projectName}</h3>
                <p>${repo.description || 'A project by ' + GITHUB_USERNAME}</p>
                <div class="project-tags">
                    ${language ? `<span style="background: ${languageColor}20; color: ${languageColor}">${language}</span>` : ''}
                    ${starsBadge}
                    ${forksBadge}
                    ${updatedDate}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);

        // Staggered entrance animation
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(30px)';
        projectCard.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        fadeObserver.observe(projectCard);
    });
}

// Load projects on page load
loadProjects();

// ============================================================
// Blog Post Data (Simple CMS)
// ============================================================
const blogPosts = {
    'web-dev-trends': {
        title: 'Top Web Development Trends in 2024',
        date: 'March 15, 2024',
        content: `
            <p>The web development landscape is constantly evolving. In 2024, several key trends are reshaping how we build and interact with web applications.</p>
            
            <h3>1. AI-Powered Development</h3>
            <p>Artificial intelligence is revolutionizing developer workflows. From code completion to automated testing, AI tools are becoming indispensable in the development process.</p>
            
            <h3>2. Serverless Architecture</h3>
            <p>Serverless computing continues to gain traction, offering scalability and cost-effectiveness for modern web applications.</p>
            
            <h3>3. WebAssembly Growth</h3>
            <p>WebAssembly (Wasm) is enabling high-performance applications in the browser, opening new possibilities for gaming and complex computations.</p>
            
            <h3>4. Edge Computing</h3>
            <p>Edge functions and CDN-based computing are reducing latency and improving user experiences globally.</p>
            
            <h3>5. Progressive Web Apps (PWAs)</h3>
            <p>PWAs continue to blur the line between web and native applications, offering offline capabilities and push notifications.</p>
        `
    },
    'react-tips': {
        title: 'React Best Practices for 2024',
        date: 'February 28, 2024',
        content: `
            <p>React continues to be the most popular frontend framework. Here are essential best practices for writing clean, efficient React code in 2024.</p>
            
            <h3>1. Use Functional Components</h3>
            <p>Embrace functional components with hooks. They're more concise and easier to test than class components.</p>
            
            <h3>2. Custom Hooks for Reusability</h3>
            <p>Extract reusable logic into custom hooks. This keeps your components clean and DRY.</p>
            
            <h3>3. Memoization Strategies</h3>
            <p>Use useMemo and useCallback wisely to prevent unnecessary re-renders, but don't over-optimize.</p>
            
            <h3>4. Component Composition</h3>
            <p>Favor composition over inheritance. Use children props and render props for flexible component patterns.</p>
            
            <h3>5. TypeScript Integration</h3>
            <p>TypeScript provides excellent type safety and developer experience. It's becoming the standard for React projects.</p>
        `
    },
    'freelance-tips': {
        title: 'How to Succeed as a Freelance Developer',
        date: 'January 10, 2024',
        content: `
            <p>Freelancing offers freedom and flexibility, but it comes with unique challenges. Here's how to build a successful freelance career.</p>
            
            <h3>1. Build Your Portfolio</h3>
            <p>A strong portfolio is your best marketing tool. Showcase diverse projects that demonstrate your skills and versatility.</p>
            
            <h3>2. Set Clear Boundaries</h3>
            <p>Define your working hours and communicate them clearly. Work-life balance is crucial for long-term success.</p>
            
            <h3>3. Continuous Learning</h3>
            <p>The tech industry evolves rapidly. Stay updated with new technologies and frameworks to remain competitive.</p>
            
            <h3>4. Client Communication</h3>
            <p>Regular updates and clear communication build trust. Always manage expectations professionally.</p>
            
            <h3>5. Financial Management</h3>
            <p>Save for taxes, build an emergency fund, and price your services based on value, not just time.</p>
        `
    }
};

// Blog Modal Functionality
const blogModal = document.getElementById('blogModal');
const blogModalClose = document.querySelector('.blog-modal-close');
const blogCards = document.querySelectorAll('.blog-card');

blogCards.forEach(card => {
    card.addEventListener('click', () => {
        const postId = card.getAttribute('data-post');
        const post = blogPosts[postId];
        
        if (post) {
            document.getElementById('modalTitle').textContent = post.title;
            document.getElementById('modalDate').textContent = post.date;
            document.getElementById('modalContent').innerHTML = post.content;
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

blogModalClose.addEventListener('click', () => {
    blogModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

blogModal.addEventListener('click', (e) => {
    if (e.target === blogModal) {
        blogModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================================
// Toast Notification System
// ============================================================
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type]} ${message}`;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ============================================================
// Enhanced Form Validation & Submission (single handler, no alert)
// ============================================================
const contactForm = document.getElementById('contactForm');
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error', 'success');
    });
});

function validateInput(e) {
    const input = e.target;
    const formGroup = input.closest('.form-group');
    
    if (!formGroup) return;
    
    if (input.hasAttribute('required') && !input.value.trim()) {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        return false;
    }
    
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
    }
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    return true;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Validate all fields
    formInputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showToast(`Thank you ${formData.name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
        
        // Clear validation states
        formInputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('success', 'error');
            }
        });
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ============================================================
// Scroll Reveal Animation
// ============================================================
const revealElements = document.querySelectorAll('.section-title, .about-text, .skills-grid, .projects-grid, .blog-grid, .contact-content');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// Add stagger animation to blog cards
const blogCardsAnim = document.querySelectorAll('.blog-card');
blogCardsAnim.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

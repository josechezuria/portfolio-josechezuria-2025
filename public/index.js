// Mobile Menu
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");
const header = document.querySelector(".header");

function openMenu() {
  navMenu.classList.add("active");
  mobileMenuToggle.classList.add("active");
  header.classList.add("menu-open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navMenu.classList.remove("active");
  mobileMenuToggle.classList.remove("active");
  header.classList.remove("menu-open");
  document.body.style.overflow = "";
}

function toggleMenu() {
  if (navMenu.classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
}

// Toggle menu on button click
mobileMenuToggle.addEventListener("click", toggleMenu);

// Close menu when clicking a nav link
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// Homelab modal data
const homelabData = {
  "phoenix-current": {
    title: "Phoenix",
    purpose: "Main orchestration & service host",
    services: [
      "AdGuard DNS - Network-wide ad blocking",
      "Tailscale subnet router - Secure remote access",
      "Portainer Server - Container management",
      "Homarr + Watchtower - Dashboard and auto-updates",
      "Nginx Proxy (public + private) - Reverse proxy",
      "Vaultwarden - Password manager",
      "Grafana + Uptime Kuma - Monitoring and alerts",
      "Web hosting + Cloudflare tunnel - Public services",
      "TrueNAS VM - Storage management"
    ]
  },
  "atlas-current": {
    title: "Atlas",
    purpose: "Storage backend + cloud",
    services: [
      "TrueNAS (NFS/SMB) - Network storage",
      "PostgreSQL - Database server",
      "Nextcloud - Personal cloud storage"
    ]
  },
  "helios-current": {
    title: "Helios",
    purpose: "Testing & game servers",
    services: [
      "Lightweight workloads - Testing environment",
      "Sandbox - Experimentation space",
      "Game server experiments - Multiplayer hosting"
    ]
  },
  "pi-fleet-current": {
    title: "Raspberry Pi Fleet",
    purpose: "Monitoring & redundancy",
    services: [
      "Independent uptime monitor (planned)",
      "DNS backup (planned)",
      "Network telemetry (not yet implemented)"
    ]
  },
  "phoenix-future": {
    title: "Phoenix 2.0",
    purpose: "Orchestration node",
    services: [
      "Homarr - Unified dashboard",
      "Portainer - Container orchestration",
      "Watchtower - Automated updates",
      "Nginx Proxy Manager - Advanced reverse proxy",
      "Vaultwarden (Tailscale) - Secure password vault",
      "Beszel monitoring - System metrics",
      "Uptime Kuma - Status monitoring",
      "Tailscale Subnet Router + CF Tunnel - Hybrid access"
    ]
  },
  "helios-future": {
    title: "Helios 2.0",
    purpose: "Lightweight node",
    services: [
      "Game servers - Minecraft, Valheim, etc.",
      "Testing VMs - Development environment",
      "Workload balancing with Phoenix - Distributed computing"
    ]
  },
  "artemis-future": {
    title: "Artemis (New Node)",
    purpose: "High-performance node",
    services: [
      "Ollama (AI/LLM) - Local AI models",
      "Jellyfin media server - Personal Netflix",
      "Immich / AI utilities - Photo management with AI",
      "GPU/CUDA/TensorRT tasks - Machine learning workloads"
    ]
  },
  "atlas-future": {
    title: "Atlas 2.0",
    purpose: "NAS + Cloud storage",
    services: [
      "TrueNAS (NFS + SMB) - Network storage",
      "Nextcloud (primary cloud) - Personal cloud platform",
      "PostgreSQL (shared DB) - Centralized database",
      "Backups/Snapshots - Data protection",
      "ECC RAM + Storage expansion - Reliability and capacity"
    ]
  },
  "pi-fleet-future": {
    title: "Raspberry Pi Fleet",
    purpose: "External monitoring & redundancy",
    services: [
      "Pi-Monitor - Uptime tracking with Discord alerts",
      "Pi-Redundancy - DNS/AdGuard backup",
      "Pi-Telemetry - Network probes, SNMP, Prometheus",
      "Pi-AI-Edge - Lightweight AI experiments"
    ]
  }
};

// Modal functionality
const modal = document.getElementById("homelab-modal");
const modalTitle = document.getElementById("modal-title");
const modalPurpose = document.getElementById("modal-purpose");
const modalServices = document.getElementById("modal-services");
const modalClose = document.querySelector(".modal-close");

// Open modal when card is clicked
document.querySelectorAll(".homelab-card").forEach(card => {
  card.addEventListener("click", () => {
    const nodeId = card.getAttribute("data-node");
    const data = homelabData[nodeId];

    if (data) {
      modalTitle.textContent = data.title;
      modalPurpose.textContent = data.purpose;

      // Build services list
      const servicesList = document.createElement("ul");
      data.services.forEach(service => {
        const li = document.createElement("li");
        li.textContent = service;
        servicesList.appendChild(li);
      });

      modalServices.innerHTML = "<h4>⚡ Services & Features</h4>";
      modalServices.appendChild(servicesList);

      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }
  });
});

// Close modal
modalClose.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = ""; // Re-enable scrolling
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Blog modal data
const blogData = {
  "docker-homelab": {
    title: "Docker Homelab Setup",
    badge: "Guide",
    date: "2025-01-15",
    tags: ["Docker", "Linux", "Homelab"],
    content: `
      <h4>Introduction</h4>
      <p>This comprehensive guide walks you through setting up Docker containers in your homelab environment. From initial installation to advanced container orchestration, you'll learn everything needed to run production-ready services.</p>

      <h4>Key Topics Covered</h4>
      <ul>
        <li>Installing Docker and Docker Compose</li>
        <li>Container networking fundamentals</li>
        <li>Volume management and persistent storage</li>
        <li>Docker Compose best practices</li>
        <li>Security hardening for homelab containers</li>
        <li>Monitoring and logging strategies</li>
      </ul>

      <h4>Prerequisites</h4>
      <ul>
        <li>Basic Linux command line knowledge</li>
        <li>A server or VM with a supported Linux distribution</li>
        <li>Root or sudo access</li>
      </ul>
    `,
    github: "https://github.com/josechezuria",
    docs: "#"
  },
  "proxmox-setup": {
    title: "Proxmox VE Guide",
    badge: "Tutorial",
    date: "2025-01-10",
    tags: ["Proxmox", "Virtualization", "Self-Hosted"],
    content: `
      <h4>Introduction</h4>
      <p>Learn how to configure and optimize Proxmox Virtual Environment for home use. This tutorial covers installation, configuration, and best practices for running a stable homelab virtualization platform.</p>

      <h4>What You'll Learn</h4>
      <ul>
        <li>Proxmox VE installation and initial setup</li>
        <li>Storage configuration (local, NFS, ZFS)</li>
        <li>VM and LXC container creation</li>
        <li>Networking setup (bridges, VLANs)</li>
        <li>Backup and restore strategies</li>
        <li>High availability clustering basics</li>
      </ul>

      <h4>Hardware Requirements</h4>
      <ul>
        <li>64-bit CPU with virtualization support (Intel VT-x/AMD-V)</li>
        <li>Minimum 4GB RAM (8GB+ recommended)</li>
        <li>At least 32GB storage for the OS</li>
      </ul>
    `,
    github: "https://github.com/josechezuria",
    docs: "#"
  },
  "nginx-reverse-proxy": {
    title: "NGINX Reverse Proxy",
    badge: "Documentation",
    date: "2025-01-05",
    tags: ["NGINX", "Security", "DevOps"],
    content: `
      <h4>Introduction</h4>
      <p>Setting up NGINX as a reverse proxy with SSL certificates is essential for securely exposing your homelab services. This guide covers everything from basic configuration to advanced SSL/TLS setup.</p>

      <h4>Topics Covered</h4>
      <ul>
        <li>Installing and configuring NGINX</li>
        <li>Reverse proxy fundamentals</li>
        <li>SSL/TLS certificate setup with Let's Encrypt</li>
        <li>Security headers and best practices</li>
        <li>WebSocket proxy configuration</li>
        <li>Load balancing basics</li>
      </ul>

      <h4>Example Use Cases</h4>
      <ul>
        <li>Exposing Docker containers with custom domains</li>
        <li>Hosting multiple web applications on one IP</li>
        <li>Adding SSL to services that don't support it natively</li>
        <li>Setting up authentication for internal services</li>
      </ul>
    `,
    github: "https://github.com/josechezuria",
    docs: "#"
  }
};

// Blog modal elements
const blogModal = document.getElementById("blog-modal");
const blogModalTitle = document.getElementById("blog-modal-title");
const blogModalMeta = document.getElementById("blog-modal-meta");
const blogModalContent = document.getElementById("blog-modal-content");
const blogModalLinks = document.getElementById("blog-modal-links");
const blogModalClose = document.querySelector(".blog-modal-close");

// Open blog modal when card is clicked
document.querySelectorAll(".blog-card").forEach(card => {
  card.addEventListener("click", () => {
    const postId = card.getAttribute("data-post");
    const data = blogData[postId];

    if (data) {
      blogModalTitle.textContent = data.title;

      // Build meta info (date and tags)
      const metaHtml = `
        <div class="blog-meta-info">
          <span class="blog-date">${new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <div class="blog-modal-tags">
            ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
          </div>
        </div>
      `;
      blogModalMeta.innerHTML = metaHtml;

      // Set content
      blogModalContent.innerHTML = data.content;

      // Build links
      const linksHtml = `
        <div class="blog-action-links">
          <a href="${data.github}" target="_blank" class="blog-link github-link">
            <i class="fab fa-github"></i> View on GitHub
          </a>
          ${data.docs !== '#' ? `<a href="${data.docs}" target="_blank" class="blog-link docs-link">
            <i class="fas fa-book"></i> Read Full Documentation
          </a>` : ''}
        </div>
      `;
      blogModalLinks.innerHTML = linksHtml;

      blogModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });
});

// Close blog modal
blogModalClose.addEventListener("click", () => {
  blogModal.classList.remove("active");
  document.body.style.overflow = "";
});

// Close blog modal when clicking outside
blogModal.addEventListener("click", (e) => {
  if (e.target === blogModal) {
    blogModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

const burger = document.getElementById("burger");
const navLinks = document.getElementById("nav-links");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  burger.classList.toggle("active");
});


// ======================
// ASCII Diagrams (clean, no remote access section)
// ======================

const diagramCurrent = `
+---------+       +----------------+       +----------------------------------+
|   ISP   | ----> |  TP-Link Router| ----> | ThinkPad (i5, 8GB RAM, 500GB SSD)|
+---------+       +----------------+       +----------------------------------+
`;

const diagramOverview = `
+----------------------+
|       Proxmox        |
|   (Bare Metal Host)  |
+----------+-----------+
           |
   +-------v--------+
   |   Ubuntu VM    |
   | (Dev Machine)  |
   +-------+--------+
           |
   +-------v---------------------------------------------------+
   |                   Docker Containers                       |
   | +--------+  +---------+  +-----------+                    |
   | | Nginx  |  | Pi-hole |  | Portainer | ...                |
   | +--------+  +---------+  +-----------+                    |
   | +--------+  +----------+ +--------------+                 |
   | |Grafana |  |Prometheus| | Node Exporter|                 |
   | +--------+  +----------+ +--------------+                 |
   | +--------+  +----------+                                  |
   | | PSQL   |  | Quizz-AI |   (future projects...)           |
   | +--------+  +----------+                                  |
   +-----------------------------------------------------------+
`;

const diagramFuture = `
                                     
+-----------------------------------+
|   Internet Service Provider       |
+----------------+------------------+
                 |
      +----------v----------+
      |    Router/Gateway   |
      +----------+----------+
                 |
   +-------------v-------------+
   |                           |
+-----------+           +--------------+
|  Mini PC  |           |  Powerful PC |
| (Proxmox) |           |   (Proxmox)  |
|           |           |              |
|  LXC:     |           |  Services:   |
| - Pi-hole |           | - Plex       |
| - Nginx   |           | - AI Model   |
| - PSQL(?) |           | - Minecraft  |
+-----------+           +--------------+
                 |
   +-------------------------------+
   |  3 x 8TB HDD Storage (TrueNAS)|
   +-------------------------------+



`;

// ======================
// Typed.js Helper
// ======================
function typeDiagram(id, text) {
  new Typed(id, {
    strings: [text],
    typeSpeed: 8,    // faster typing (~125 chars/sec)
    showCursor: false
  });
}

// ======================
// Intersection Observer
// ======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === "diagram-current") typeDiagram("#diagram-current", diagramCurrent);
      if (entry.target.id === "diagram-overview") typeDiagram("#diagram-overview", diagramOverview);
      if (entry.target.id === "diagram-future") typeDiagram("#diagram-future", diagramFuture);
      observer.unobserve(entry.target); // run once per diagram
    }
  });
}, { threshold: 0.3 });

observer.observe(document.getElementById("diagram-current"));
observer.observe(document.getElementById("diagram-overview"));
observer.observe(document.getElementById("diagram-future"));

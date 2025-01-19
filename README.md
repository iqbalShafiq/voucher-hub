
<div align="center">  
  <h1>🎫 Voucher Hub</h1>  
  <p><i>A voucher management system built with Elysia.js and Bun runtime, providing APIs for brand vouchers, transactions, and redemption management.</i></p>  

  <p>  
    <a href="#tech-stack">Tech Stack</a> •  
    <a href="#features">Features</a> •  
    <a href="#prerequisites">Prerequisites</a> •  
    <a href="#getting-started">Getting Started</a> •  
    <a href="#api-endpoints">API Endpoints</a> •  
    <a href="#running-test">Running Test</a> •  
    <a href="#documentation-endpoints">Swagger Documentation Endpoints</a>  
  </p>  
</div>  

<div id="tech-stack">  
  <h2>🛠️ Tech Stack</h2>  
  <p align="center">  
    <img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun"/>  
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>  
    <img src="https://img.shields.io/badge/Elysia-000000?style=for-the-badge" alt="ElysiaJS"/>  
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>  
    <img src="https://img.shields.io/badge/Postgres-07405E?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres"/>  
  </p>  

  <ul>  
    <li>🚀 <strong>Bun</strong> - All-in-one JavaScript runtime & toolkit</li>  
    <li>🎯 <strong>ElysiaJS</strong> - Fast and type-safe Bun web framework</li>  
    <li>📊 <strong>Prisma</strong> - Modern database ORM</li>  
    <li>🗄️ <strong>PostgreSQL</strong> - An open source relational database </li>  
    <li>📘 <strong>TypeScript</strong> - For type safety and better developer experience</li>  
  </ul>  
</div>  

<div id="features">  
  <h2>✨ Features</h2>  
  <ul>  
    <li>Brand Management</li>  
    <li>Voucher Creation and Management</li>  
    <li>Voucher Redemption System</li>  
    <li>Transaction Processing</li>  
    <li>JWT Authentication</li>  
    <li>Swagger API Documentation</li>  
  </ul>  
</div>  

<div id="prerequisites">  
  <h2>📋 Prerequisites</h2>  
  <ul>  
    <li>  
        <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a>  
        <span class="version">(v18 or higher)</span>  
    </li>  
    <li>  
        <a href="https://bun.sh/" target="_blank" rel="noopener noreferrer">Bun</a>  
        <span class="version">(Latest)</span>  
    </li>  
    <li>  
        <a href="https://www.postgresql.org/" target="_blank" rel="noopener noreferrer">PostgreSQL</a>    
    </li>  
  </ul>  
</div>  

<div id="getting-started">  
  <h2>🚀 Getting Started</h2>  

 ```bash  
 # Clone the repository 
 git clone https://github.com/iqbalShafiq/voucher-hub.git  
 
 # Navigate to the project directory 
 cd voucher-hub  
 
 # Install dependencies 
 bun install  
 
 # Create environment variables file 
 cp .env.example .env 
 
 # Edit the .env file with your configuration  
 
 # Generate prisma client 
 bunx prisma generate
 
 # Run database migrations 
 bunx prisma migrate dev --name init  
 
 # Run database seeding
 bunx prisma db seed
 
 # Start the development server 
 bun dev  
 ```  
</div> 


<div id="running-test">  
  <h2>🧪 Running Test</h2>

  ```bash
    # Run test
    bun test
  ```

</div>

<div id="api-endpoints">  
  <h2>🔌 API Endpoints</h2>  
  <p>Base URL: <code>http://localhost:8000</code></p>  
</div>

<div id="documentation-endpoints">  
  <h2>📝 Swagger Documentation Endpoint</h2>  
  <p>Doc URL: <code>http://localhost:8000/docs</code></p>  

<h3>Brand</h3>
  <table>  
    <thead>  
      <tr>  
        <th>Method</th>  
        <th>Endpoint</th>  
        <th>Description</th> 
      </tr>  
    </thead>  
    <tbody>  
      <tr>  
        <td><code>POST</code></td>  
        <td><code>/brand</code></td>  
        <td>Create new user</td>
      </tr>  
    </tbody>  
  </table>  

<h3>Vouchers</h3>
  <table>  
    <thead>  
      <tr>  
        <th>Method</th>  
        <th>Endpoint</th>  
        <th>Description</th> 
      </tr>  
    </thead>  
    <tbody>  
      <tr>  
        <td><code>GET</code></td>  
        <td><code>/voucher</code></td>  
        <td>Get all vouchers</td> 
      </tr>  
      <tr>  
        <td><code>GET</code></td>  
        <td><code>/voucher/brand?id={id}</code></td>  
        <td>Get voucher by brand ID</td>  
      </tr>  
      <tr>  
        <td><code>POST</code></td>  
        <td><code>/voucher</code></td>  
        <td>Create new voucher</td> 
      </tr> 
    </tbody>  
  </table>  

<h3>Transaction</h3>
  <table>  
    <thead>  
      <tr>  
        <th>Method</th>  
        <th>Endpoint</th>  
        <th>Description</th> 
      </tr>  
    </thead>  
    <tbody>  
      <tr>  
        <td><code>GET</code></td>  
        <td><code>/transaction/redemption?transactionId={transactionId}</code></td>  
        <td>Get user's redemptions history</td>  
      </tr>  
      <tr>  
        <td><code>POST</code></td>  
        <td><code>/transaction/redemption</code></td>  
        <td>Create new redemption</td>  
      </tr>  
    </tbody>  
  </table>  
</div>  
<div id="footer">  
  <hr>  

  <p align="left">  
    Built by <a href="https://github.com/iqbalShafiq">Iqbal Shafiq</a>  
  </p>  
</div>
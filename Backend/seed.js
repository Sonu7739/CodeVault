const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Snippet = require('./models/Snippet');
const Bookmark = require('./models/Bookmark');

dotenv.config();

const sampleUsers = [
  {
    username: 'alex_dev',
    email: 'alex@codevault.dev',
    password: 'password123',
    bio: 'Senior Backend Engineer | Golang, Python & Distributed Systems enthusiast.',
    avatar: ''
  },
  {
    username: 'sarah_codes',
    email: 'sarah@codevault.dev',
    password: 'password123',
    bio: 'Frontend Architect specializing in React, TypeScript and Design Systems.',
    avatar: ''
  },
  {
    username: 'marcus_db',
    email: 'marcus@codevault.dev',
    password: 'password123',
    bio: 'Database Architect & Cloud Specialist. SQL optimizer & MongoDB whisperer.',
    avatar: ''
  }
];

const sampleSnippets = [
  {
    title: 'Custom React Debounced Hook with Cleanup',
    description: 'A robust custom React hook to debounce fast-changing state values such as search input queries with cleanup timeout.',
    language: 'TypeScript',
    tags: ['react', 'typescript', 'hooks', 'performance'],
    visibility: 'public',
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`
  },
  {
    title: 'FastAPI Async Sliding-Window Rate Limiter',
    description: 'Sliding window in-memory rate limiter middleware for FastAPI REST API endpoints.',
    language: 'Python',
    tags: ['python', 'fastapi', 'security', 'ratelimit', 'backend'],
    visibility: 'public',
    code: `import time
from collections import defaultdict
from fastapi import Request, HTTPException, status

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.history = defaultdict(list)

    async def check(self, request: Request):
        client_ip = request.client.host
        now = time.time()
        cutoff = now - self.window_seconds

        # Clean old timestamps
        self.history[client_ip] = [ts for ts in self.history[client_ip] if ts > cutoff]

        if len(self.history[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later."
            )

        self.history[client_ip].append(now)`
  },
  {
    title: 'Go Buffered Worker Pool with Context Cancellation',
    description: 'Production-ready concurrent worker pool pattern in Go using channels, sync.WaitGroup, and context.',
    language: 'Go',
    tags: ['go', 'concurrency', 'goroutines', 'channels'],
    visibility: 'public',
    code: `package main

import (
	"context"
	"fmt"
	"sync"
)

type Job struct {
	ID   int
	Data string
}

func Worker(ctx context.Context, id int, jobs <-chan Job, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		case job, ok := <-jobs:
			if !ok {
				return
			}
			results <- fmt.Sprintf("Worker %d executed job %d: %s", id, job.ID, job.Data)
		}
	}
}`
  },
  {
    title: 'Thread-Safe LRU Cache with Generics',
    description: 'High-performance Least Recently Used (LRU) Cache implementation in Rust using HashMap and doubly linked indices.',
    language: 'Rust',
    tags: ['rust', 'datastructures', 'concurrency', 'algorithms'],
    visibility: 'public',
    code: `use std::collections::HashMap;
use std::hash::Hash;

pub struct LruCache<K, V> {
    capacity: usize,
    map: HashMap<K, V>,
    order: Vec<K>,
}

impl<K: Clone + Eq + Hash, V> LruCache<K, V> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity > 0);
        Self {
            capacity,
            map: HashMap::with_capacity(capacity),
            order: Vec::with_capacity(capacity),
        }
    }

    pub fn get(&mut self, key: &K) -> Option<&V> {
        if self.map.contains_key(key) {
            self.order.retain(|k| k != key);
            self.order.push(key.clone());
            self.map.get(key)
        } else {
            None
        }
    }
}`
  },
  {
    title: 'Hierarchical Org Chart Recursive CTE Query',
    description: 'An ANSI-compliant SQL recursive Common Table Expression to traverse multi-level management structures.',
    language: 'SQL',
    tags: ['sql', 'database', 'queries', 'cte'],
    visibility: 'public',
    code: `WITH RECURSIVE EmployeeHierarchy AS (
    -- Anchor member: select top-level leadership (no manager)
    SELECT 
        emp_id, 
        full_name, 
        manager_id, 
        title, 
        1 AS org_level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive member: select all direct reports
    SELECT 
        e.emp_id, 
        e.full_name, 
        e.manager_id, 
        e.title, 
        eh.org_level + 1
    FROM employees e
    INNER JOIN EmployeeHierarchy eh ON e.manager_id = eh.emp_id
)
SELECT * FROM EmployeeHierarchy ORDER BY org_level, manager_id;`
  },
  {
    title: 'Spring Boot Global Exception Handler & ProblemDetails',
    description: 'Enterprise grade RFC-7807 compliant error responses using @RestControllerAdvice in Spring Boot 3.',
    language: 'Java',
    tags: ['java', 'spring-boot', 'rest-api', 'error-handling'],
    visibility: 'public',
    code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, 
            ex.getMessage()
        );
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Validation Failed");
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(f -> errors.put(f.getField(), f.getDefaultMessage()));
        problem.setProperty("invalidFields", errors);
        return problem;
    }
}`
  },
  {
    title: 'Docker Automated Database Volume Backup Script',
    description: 'A battle-tested bash script to perform compressed rolling backups of Docker container database volumes.',
    language: 'Bash',
    tags: ['bash', 'devops', 'docker', 'backup', 'automation'],
    visibility: 'public',
    code: `#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/codevault"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="codevault-mongodb"
ARCHIVE_NAME="mongo_backup_\${TIMESTAMP}.tar.gz"

mkdir -p "\${BACKUP_DIR}"

echo "[*] Creating database archive for container: \${CONTAINER_NAME}..."
docker exec -t "\${CONTAINER_NAME}" mongodump --archive --gzip > "\${BACKUP_DIR}/\${ARCHIVE_NAME}"

# Keep only the last 7 daily archives
echo "[*] Pruning archives older than 7 days..."
find "\${BACKUP_DIR}" -type f -name "mongo_backup_*.tar.gz" -mtime +7 -delete

echo "[✓] Backup completed successfully: \${BACKUP_DIR}/\${ARCHIVE_NAME}"`
  }
];

const seedData = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is not defined in server/.env. Please configure your Atlas connection string.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI, { dbName: 'CodeVaultDB' });
    console.log('✔ Connected to CodeVaultDB.');

    console.log('Cleaning existing collections...');
    try {
      const indexes = await Snippet.collection.indexes();
      for (const idx of indexes) {
        if (((idx.key && idx.key._fts === 'text') || idx.textIndexVersion) && idx.language_override !== 'none') {
          await Snippet.collection.dropIndex(idx.name);
        }
      }
    } catch (_) {}
    await Bookmark.deleteMany({});
    await Snippet.deleteMany({});
    await User.deleteMany({});

    console.log('Creating sample developers...');
    const createdUsers = [];
    for (const u of sampleUsers) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }
    console.log(`✔ Created ${createdUsers.length} developers.`);

    console.log('Seeding code snippets...');
    const createdSnippets = [];
    for (let i = 0; i < sampleSnippets.length; i++) {
      const assignedUser = createdUsers[i % createdUsers.length];
      const otherUser = createdUsers[(i + 1) % createdUsers.length];

      const snippet = await Snippet.create({
        ...sampleSnippets[i],
        userId: assignedUser._id,
        likes: [otherUser._id]
      });
      createdSnippets.push(snippet);
    }
    console.log(`✔ Created ${createdSnippets.length} initial snippets.`);

    console.log('Adding initial bookmarks...');
    await Bookmark.create({
      userId: createdUsers[0]._id,
      snippetId: createdSnippets[1]._id
    });
    await Bookmark.create({
      userId: createdUsers[1]._id,
      snippetId: createdSnippets[0]._id
    });
    console.log('✔ Bookmarks linked successfully.');

    console.log('\n===========================================');
    console.log('🚀 Database Seeding Completed Successfully!');
    console.log('===========================================');
    console.log('Default Seed Accounts (password is "password123"):');
    sampleUsers.forEach((u) => console.log(` - ${u.username} (${u.email})`));
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();


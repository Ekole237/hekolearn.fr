# Création d'une Plateforme d'Apprentissage Moderne avec Next.js 14, TypeScript et Supabase

## Introduction

Dans cet article, nous allons explorer la création d'une plateforme d'apprentissage en ligne moderne utilisant les dernières technologies web. Notre stack technique comprend Next.js 14, TypeScript, Supabase pour l'authentification et le stockage, et une UI moderne avec Radix UI et Tailwind CSS.

## Table des Matières

1. [Configuration Initiale](#configuration-initiale)
2. [Architecture du Projet](#architecture-du-projet)
3. [Système d'Authentification](#système-dauthentification)
4. [Base de Données et Types](#base-de-données-et-types)
5. [Interface Utilisateur](#interface-utilisateur)
6. [Déploiement](#déploiement)

## Configuration Initiale

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Création du Projet

```bash
npx create-next-app@latest site-web --typescript --tailwind --app
cd site-web
```

### Installation des Dépendances

```bash
npm install @supabase/auth-helpers-nextjs @supabase/auth-ui-react @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react
```

## Architecture du Projet

```
site-web/
├── app/
│   ├── (authenticated)/
│   │   ├── courses/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── navbar.tsx
├── lib/
│   ├── auth/
│   │   ├── context.ts
│   │   ├── hooks.ts
│   │   └── session.ts
│   └── supabase/
├── types/
│   ├── auth.types.ts
│   └── database.types.ts
└── middleware.ts
```

## Système d'Authentification

### 1. Configuration des Types (types/auth.types.ts)

```typescript
import { User } from '@supabase/auth-helpers-nextjs';

export type UserRole = 'student' | 'teacher';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

### 2. Contexte d'Authentification (lib/auth/context.ts)

```typescript
import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  // Implémentation du provider...
}
```

### 3. Hooks Personnalisés (lib/auth/hooks.ts)

```typescript
export function useRequireAuth(requiredRole?: UserRole) {
  // Implémentation de la protection des routes...
}

export function useRedirectIfAuthenticated() {
  // Implémentation de la redirection...
}
```

## Base de Données et Types

### Structure de la Base de Données Supabase

```sql
-- Création des tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

## Interface Utilisateur

### 1. Navigation (components/navbar.tsx)

```typescript
export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-background">
      {/* Implémentation de la navbar... */}
    </nav>
  );
}
```

### 2. Layout Authentifié (app/(authenticated)/layout.tsx)

```typescript
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

## Protection des Routes (middleware.ts)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Implémentation du middleware...
}
```

## Fonctionnalités Clés

1. **Authentification**
   - Connexion par email/mot de passe
   - Connexion avec Google
   - Protection des routes
   - Gestion des rôles

2. **Gestion des Cours**
   - Création de cours (enseignants)
   - Inscription aux cours (étudiants)
   - Suivi de la progression

3. **Interface Utilisateur**
   - Design responsive
   - Thème clair/sombre
   - Composants réutilisables

## Déploiement

1. **Configuration de Supabase**
   ```bash
   # Installation de Supabase CLI
   npm install -g supabase-cli
   
   # Login et configuration
   supabase login
   supabase init
   ```

2. **Variables d'Environnement**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
   ```

3. **Déploiement sur Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

## Migration vers AdonisJS : Backend Robuste et Typé

### Table des Matières - Backend AdonisJS

1. [Configuration d'AdonisJS](#configuration-dadonisjs)
2. [Structure de la Base de Données](#structure-de-la-base-de-données)
3. [Authentification et Autorisation](#authentification-et-autorisation)
4. [Controllers et Routes](#controllers-et-routes)
5. [Policies et Bouncer](#policies-et-bouncer)
6. [Middleware et Validators](#middleware-et-validators)
7. [Tests et Documentation](#tests-et-documentation)

### Configuration d'AdonisJS

#### Installation et Configuration Initiale

```bash
npm init adonis-ts-app@latest backend
cd backend
npm i @adonisjs/auth @adonisjs/lucid @adonisjs/mail @adonisjs/redis
```

#### Configuration de la Base de Données (config/database.ts)

```typescript
import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'

const databaseConfig: DatabaseConfig = {
  connection: Env.get('DB_CONNECTION'),
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: Env.get('DB_HOST'),
        port: Env.get('DB_PORT'),
        user: Env.get('DB_USER'),
        password: Env.get('DB_PASSWORD'),
        database: Env.get('DB_NAME'),
      },
    },
  },
}

export default databaseConfig
```

### Structure de la Base de Données

#### Migrations

```typescript
// database/migrations/1_users.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.string('full_name')
      table.string('avatar_url')
      table.enum('role', ['student', 'teacher']).defaultTo('student')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }
}

// database/migrations/2_courses.ts
export default class Courses extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title').notNullable()
      table.text('description')
      table.string('slug').unique()
      table.uuid('author_id').references('id').inTable('users')
      table.boolean('published').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }
}
```

#### Modèles

```typescript
// app/Models/User.ts
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Course from './Course'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public fullName: string | null

  @column()
  public avatarUrl: string | null

  @column()
  public role: 'student' | 'teacher'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Course, { foreignKey: 'authorId' })
  public courses: HasMany<typeof Course>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
```

### Authentification et Autorisation

#### Configuration Auth (config/auth.ts)

```typescript
import { AuthConfig } from '@ioc:Adonis/Addons/Auth'

const authConfig: AuthConfig = {
  guard: 'api',
  guards: {
    api: {
      driver: 'jwt',
      provider: {
        driver: 'lucid',
        identifierKey: 'id',
        uids: ['email'],
        model: () => import('App/Models/User'),
      },
      token: {
        expiresIn: '7days',
      },
    },
  },
}

export default authConfig
```

#### Middleware d'Authentification

```typescript
// app/Middleware/Auth.ts
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  protected async authenticate(auth: HttpContextContract['auth']) {
    await auth.use('api').authenticate()
  }

  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[]
  ) {
    await this.authenticate(auth)
    await next()
  }
}
```

### Controllers et Routes

#### Controllers

```typescript
// app/Controllers/Http/CoursesController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'

export default class CoursesController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const courses = await Course.query()
      .where('published', true)
      .preload('author')
      .paginate(page, limit)

    return response.json(courses)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(CreateCourseValidator)
    const user = auth.user!

    const course = await user.related('courses').create(payload)
    await course.load('author')

    return response.json(course)
  }

  public async show({ params, response }: HttpContextContract) {
    const course = await Course.query()
      .where('id', params.id)
      .preload('author')
      .firstOrFail()

    return response.json(course)
  }
}
```

#### Routes

```typescript
// start/routes.ts
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register')
  Route.post('auth/login', 'AuthController.login')
  
  Route.group(() => {
    Route.resource('courses', 'CoursesController').apiOnly()
    Route.resource('lessons', 'LessonsController').apiOnly()
    Route.post('courses/:id/enroll', 'CoursesController.enroll')
  }).middleware('auth')
}).prefix('api')
```

### Policies et Bouncer

#### Configuration du Bouncer

```typescript
// start/bouncer.ts
import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Course from 'App/Models/Course'

export const { actions } = Bouncer
  .define('updateCourse', (user: User, course: Course) => {
    return user.id === course.authorId || user.role === 'admin'
  })
  .define('createCourse', (user: User) => {
    return user.role === 'teacher'
  })
```

#### Policies

```typescript
// app/Policies/CoursePolicy.ts
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Course from 'App/Models/Course'

export default class CoursePolicy extends BasePolicy {
  public async view(user: User, course: Course) {
    return course.published || user.id === course.authorId
  }

  public async update(user: User, course: Course) {
    return user.id === course.authorId
  }

  public async delete(user: User, course: Course) {
    return user.id === course.authorId
  }
}
```

### Middleware et Validators

#### Validators

```typescript
// app/Validators/CreateCourseValidator.ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateCourseValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(3),
    ]),
    description: schema.string.optional({ trim: true }),
    published: schema.boolean.optional(),
  })

  public messages = {
    'title.required': 'Le titre est requis',
    'title.minLength': 'Le titre doit contenir au moins 3 caractères',
  }
}
```

#### Middleware Personnalisé

```typescript
// app/Middleware/TeacherOnly.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TeacherOnly {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const user = auth.user
    
    if (!user || user.role !== 'teacher') {
      return response.forbidden({ 
        message: 'Accès réservé aux enseignants' 
      })
    }

    await next()
  }
}
```

### Tests et Documentation

#### Tests

```typescript
// tests/course.spec.ts
import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Courses', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('ensure user can create course', async (assert) => {
    const user = await Factory.model('App/Models/User').create()
    const response = await supertest(BASE_URL)
      .post('/api/courses')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'Mon cours',
        description: 'Description du cours',
      })

    response.assertStatus(200)
    assert.equal(response.body.title, 'Mon cours')
  })
})
```

### Intégration avec le Frontend Next.js

#### Configuration Axios

```typescript
// frontend/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

#### Hooks d'API

```typescript
// frontend/hooks/useCourses.ts
import { useQuery, useMutation } from 'react-query'
import api from '@/lib/api'

export function useCourses() {
  return useQuery('courses', async () => {
    const { data } = await api.get('/courses')
    return data
  })
}

export function useCreateCourse() {
  return useMutation(async (courseData) => {
    const { data } = await api.post('/courses', courseData)
    return data
  })
}
```

### Déploiement

#### Configuration PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'adonis-api',
    script: 'build/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3333
    }
  }]
}
```

#### Script de Déploiement

```bash
#!/bin/bash
# deploy.sh

# Build
node ace build --production

# Migrations
node ace migration:run

# Start/Restart PM2
pm2 restart ecosystem.config.js
```

## Conclusion

Cette implémentation avec AdonisJS offre :
- Une structure robuste et typée
- Une gestion fine des autorisations
- Des validations de données
- Des tests automatisés
- Une intégration facile avec le frontend Next.js

Le backend AdonisJS peut facilement remplacer Supabase tout en offrant plus de flexibilité et de contrôle sur l'application.

## Ressources Additionnelles

- [Documentation AdonisJS](https://docs.adonisjs.com/)
- [Documentation Lucid ORM](https://docs.adonisjs.com/guides/database/introduction)
- [Guide des Tests](https://docs.adonisjs.com/guides/testing/introduction)
- [Déploiement](https://docs.adonisjs.com/guides/deployment)

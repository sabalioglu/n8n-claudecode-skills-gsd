# REQUIREMENTS: [Project Name]

> GSD Requirements Template - Detailed functional and non-functional requirements

---

## Functional Requirements

### Core Features

#### FR-001: [Feature Name]
- **Description:** [What it does]
- **User Story:** As a [user type], I want to [action] so that [benefit]
- **Acceptance Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
  - [ ] [Criterion 3]
- **Priority:** High | Medium | Low

#### FR-002: [Feature Name]
- **Description:** [What it does]
- **User Story:** As a [user type], I want to [action] so that [benefit]
- **Acceptance Criteria:**
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
- **Priority:** High | Medium | Low

---

## Non-Functional Requirements

### Performance
- **NFR-P001:** Page load time < [X] seconds
- **NFR-P002:** API response time < [X] ms
- **NFR-P003:** Support [X] concurrent users

### Security
- **NFR-S001:** All data encrypted at rest and in transit
- **NFR-S002:** Authentication via [method]
- **NFR-S003:** Authorization with [approach]

### Reliability
- **NFR-R001:** [X]% uptime target
- **NFR-R002:** Automated backups every [X] hours

### Scalability
- **NFR-SC001:** Horizontal scaling support
- **NFR-SC002:** Database sharding ready

---

## Data Requirements

### Data Model Overview

| Entity | Description | Key Fields |
|--------|-------------|------------|
| [Entity 1] | [Description] | [Fields] |
| [Entity 2] | [Description] | [Fields] |

### Data Flow
```
[Source] --> [Process] --> [Destination]
```

---

## API Requirements

### Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/[resource] | [Description] | Yes/No |
| POST | /api/[resource] | [Description] | Yes/No |
| PUT | /api/[resource]/:id | [Description] | Yes/No |
| DELETE | /api/[resource]/:id | [Description] | Yes/No |

---

## Integration Requirements

### External Services

| Service | Purpose | API Type |
|---------|---------|----------|
| [Service 1] | [Purpose] | REST/GraphQL/WebSocket |
| [Service 2] | [Purpose] | REST/GraphQL/WebSocket |

---

## Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| [Field 1] | [Rule] | [Message] |
| [Field 2] | [Rule] | [Message] |

---

*Created with Get Shit Done (GSD) methodology*

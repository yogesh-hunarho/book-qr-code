# Project Flowchart & Architecture

This document provides a visual representation of the Book QR Code project, detailing the data hierarchy and the administrative workflow.

## 1. System Architecture Flowchart

```mermaid
graph TD
    subgraph Admin_Panel [Admin Dashboard /admin]
        A[Login] --> B[Grade Management]
        B --> C{Action}
        C -- Create/Edit Grade --> D[GradeForm]
        C -- Manage Chapters --> E[Grade Details Page]
    end

    subgraph Grade_Management [Grade Details /admin/grade/id]
        E --> F{Chapter Action}
        F -- Create/Edit Chapter --> G[ChapterForm]
        F -- Generate QR --> H[QR Code Generation]
    end

    subgraph Chapter_Hierarchy [Chapter Data Structure]
        G --> I[Chapter Basic Info]
        I --> J[STEM DIY Video URL - Optional]
        I --> K[Chapter Modules - Optional]
        
        K --> L[Module Video URL]
        K --> M[Module Quiz - Optional]
        
        M --> N[Quiz Questions]
    end

    subgraph User_Experience [Student View /grade/id]
        O[Scan QR Code] --> P[Chapter View Page]
        P --> Q[Watch STEM DIY Video]
        P --> R[Browse Modules]
        R --> S[Watch Module Video]
        R --> T[Take Quiz]
    end

    %% Relationships
    D -.-> B
    G -.-> E
    H -.-> O
```

## 2. Data Model Relationship (Entity-Relationship)

```mermaid
erDiagram
    GRADE ||--o{ CHAPTER : contains
    CHAPTER ||--o{ CHAPTER_MODULE : has
    CHAPTER_MODULE ||--o| QUIZ : optional
    QUIZ ||--o{ QUESTION : contains

    GRADE {
        string id PK
        int grade
        string title
    }

    CHAPTER {
        string id PK
        string gradeId FK
        int chapterNo
        string title
        string stemVideoUrl "Optional"
    }

    CHAPTER_MODULE {
        string id PK
        string chapterId FK
        string title
        string videoUrl
        int order
    }

    QUIZ {
        string id PK
        string moduleId FK
        string title
        int totalQuestions
    }

    QUESTION {
        string id PK
        string quizId FK
        string question
        json options
        string correctAnswer
        string hint
    }
```

## 3. Administrative Workflow Detail

1.  **Grade Creation**: Admin starts by defining a Grade (e.g., Grade 1, Grade 2).
2.  **Chapter Setup**: For each Grade, chapters are added.
    *   **STEM DIY Video**: A specific video URL for the entire chapter (often a hands-on activity).
3.  **Module Integration (Optional)**: Chapters can be broken down into smaller modules.
    *   **Module Videos**: Targeted educational videos for specific topics within the chapter.
    *   **Interactive Quizzes**: Each module can optionally include a quiz to test knowledge.
4.  **Distribution**: Once content is ready, a QR code is generated for the chapter, allowing students to access the digital content directly from their physical textbooks.

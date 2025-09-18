<div align="center">

<br />

<!-- Project Logo -->
<img src="https://placehold.co/150x150/7c3aed/ffffff?text=EH" alt="EventHive Logo" width="150" height="150">

<br /><br />

# **EventHive - Software Requirements Specification (SRS)**  
_Map-based event discovery meets community chat — Connecting India through events and conversations._

<br />

[![SRS Version](https://img.shields.io/badge/SRS%20Version-1.0-blue)](#) 
[![Standard](https://img.shields.io/badge/Standard-IEEE%20830--1998-green)](#) 
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](#) 
[![License: MIT](https://img.shields.io/badge/License-MIT-purple)](./LICENSE)

</div>

---

## 📑 Table of Contents
1. [About This Document](#about-this-document)  
2. [Document Purpose and Audience](#document-purpose-and-audience)  
3. [How to Generate the PDF](#how-to-generate-the-pdf)  
4. [Structure of the SRS](#structure-of-the-srs)  
5. [Contributing](#contributing)  
6. [License](#license)  

---

## 1. About This Document  
This document meticulously details the **system features, constraints, and external interfaces** of the EventHive software. It serves as the **foundational agreement** between stakeholders and the development team, guiding the entire software development lifecycle.

### ✅ Standard Compliance  
This SRS is structured in accordance with the **IEEE Std 830-1998**, ensuring it is:  
- Comprehensive  
- Unambiguous  
- Verifiable  
- Modifiable  

---

## 2. Document Purpose and Audience  

This document is the **single source of truth** for all project requirements.  

**Intended audience includes:**  
- 🎯 **Stakeholders & Clients** → Understand scope, capabilities, and business goals.  
- 📊 **Project Managers** → Aid in planning, scheduling, and scope management.  
- 🏗️ **System Architects & Designers** → Reference for architecture and design.  
- 👨‍💻 **Developers** → Precise understanding of what to build.  
- ✅ **QA & Testers** → Basis for test plans and acceptance criteria.  

---

## 3. How to Generate the PDF  

The source file is written in **LaTeX** (`EventHive_SRS.tex`) for professional typesetting.  

### 🔧 Prerequisites  
- TeX Live (Linux, Windows, macOS)  
- MiKTeX (Windows)  
- MacTeX (macOS)  

### ⚙️ Compilation Steps  
```bash
# Clone the repository
git clone <repo-url>
cd repository

# Run pdflatex twice for references and TOC
pdflatex EventHive_SRS.tex
pdflatex EventHive_SRS.tex

# Makefile for @parkineo/time-picker
# A lightweight, framework-agnostic time picker component

# Variables
PACKAGE_NAME = @parkineo/time-picker
VERSION = $(shell node -p "require('./package.json').version")
NODE_MODULES = node_modules
DIST_DIR = dist
SRC_DIR = src
EXAMPLES_DIR = examples
COVERAGE_DIR = coverage

# Files to update with version
DIST_VERSION_FILES = dist/time-picker.js dist/time-picker.esm.js dist/time-picker.d.ts

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color
BOLD = \033[1m

# Default target
.DEFAULT_GOAL := help

# Version update targets
.PHONY: update-version-comments
update-version-comments: ## Update version in source file comments
	@echo "$(GREEN)Updating version comments to v$(VERSION)...$(NC)"
	@if [ -f "$(SRC_DIR)/time-picker.ts" ]; then \
		echo "  Updating $(SRC_DIR)/time-picker.ts"; \
		sed -i.bak 's/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $(VERSION)/g' "$(SRC_DIR)/time-picker.ts" && rm "$(SRC_DIR)/time-picker.ts.bak" || rm -f "$(SRC_DIR)/time-picker.ts.bak"; \
	fi
	@if [ -f "$(SRC_DIR)/time-picker.css" ]; then \
		echo "  Updating $(SRC_DIR)/time-picker.css"; \
		sed -i.bak 's/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $(VERSION)/g' "$(SRC_DIR)/time-picker.css" && rm "$(SRC_DIR)/time-picker.css.bak" || rm -f "$(SRC_DIR)/time-picker.css.bak"; \
	fi
	@echo "$(GREEN)✓ Version comments updated to v$(VERSION)$(NC)"

.PHONY: update-dist-version
update-dist-version: ## Update version in built dist files
	@echo "$(GREEN)Updating version in dist files to v$(VERSION)...$(NC)"
	@if [ -d "$(DIST_DIR)" ]; then \
		for file in $(DIST_VERSION_FILES); do \
			if [ -f "$file" ]; then \
				echo "  Updating $file"; \
				sed -i.bak 's/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $(VERSION)/g' "$file" && rm "$file.bak" || rm -f "$file.bak"; \
				sed -i.bak 's/version: "[0-9]\+\.[0-9]\+\.[0-9]\+"/version: "$(VERSION)"/g' "$file" && rm "$file.bak" || rm -f "$file.bak"; \
				sed -i.bak "s/version: '[0-9]\+\.[0-9]\+\.[0-9]\+'/version: '$(VERSION)'/g" "$file" && rm "$file.bak" || rm -f "$file.bak"; \
			fi; \
		done; \
		if [ -f "$(DIST_DIR)/time-picker.css" ]; then \
			echo "  Updating $(DIST_DIR)/time-picker.css"; \
			sed -i.bak 's/@version [0-9]\+\.[0-9]\+\.[0-9]\+/@version $(VERSION)/g' "$(DIST_DIR)/time-picker.css" && rm "$(DIST_DIR)/time-picker.css.bak" || rm -f "$(DIST_DIR)/time-picker.css.bak"; \
		fi; \
		echo "$(GREEN)✓ Dist version updated to v$(VERSION)$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Dist directory not found, skipping dist version update$(NC)"; \
	fi

.PHONY: update-all-versions
update-all-versions: update-version-comments update-dist-version ## Update version in both source and dist files

.PHONY: version-patch
version-patch: check-deps ## Bump patch version (1.0.0 -> 1.0.1)
	@echo "$(GREEN)Bumping patch version...$(NC)"
	npm version patch --no-git-tag-version]
	@$(MAKE) update-version-comments
	@echo "$(GREEN)✓ Version bumped to $(shell node -p "require('./package.json').version")$(NC)"

.PHONY: version-minor
version-minor: check-deps ## Bump minor version (1.0.0 -> 1.1.0)
	@echo "$(GREEN)Bumping minor version...$(NC)"
	npm version minor --no-git-tag-version]
	@$(MAKE) update-version-comments
	@echo "$(GREEN)✓ Version bumped to $(shell node -p "require('./package.json').version")$(NC)"

.PHONY: version-major
version-major: check-deps ## Bump major version (1.0.0 -> 2.0.0)
	@echo "$(GREEN)Bumping major version...$(NC)"
	npm version major --no-git-tag-version]
	@$(MAKE) update-version-comments
	@echo "$(GREEN)✓ Version bumped to $(shell node -p "require('./package.json').version")$(NC)"

# Build targets with version update
.PHONY: build
build: check-deps clean update-version-comments ## Build project with version injection
	@echo "$(GREEN)Building project with version v$(VERSION)...$(NC)"
	@echo "$(YELLOW)• Versions will be injected during build process$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build completed with version v$(VERSION)$(NC)"
	@$(MAKE) build-info

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(BOLD)$(PACKAGE_NAME) - Makefile Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make install               # Install dependencies"
	@echo "  make build                 # Build the project"
	@echo "  make dev                   # Start development mode"
	@echo "  make update-version-comments # Update version in source files"
	@echo "  make update-dist-version   # Update version in dist files"
	@echo "  make update-all-versions   # Update version in all files"
	@echo "  make publish               # Publish to NPM"

# Installation targets
.PHONY: install
install: ## Install project dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

.PHONY: install-clean
install-clean: ## Clean install (remove node_modules and package-lock.json first)
	@echo "$(YELLOW)Cleaning previous installation...$(NC)"
	rm -rf $(NODE_MODULES) package-lock.json
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Clean installation completed$(NC)"

# Development targets
.PHONY: dev
dev: check-deps ## Start development server with file watching
	@echo "$(GREEN)Starting development server...$(NC)"
	@echo "$(YELLOW)Files will be rebuilt automatically on changes$(NC)"
	npm run dev

.PHONY: serve
serve: check-deps build ## Start local server for examples
	@echo "$(GREEN)Starting example server at http://localhost:8080$(NC)"
	npm run serve

.PHONY: watch
watch: check-deps ## Watch for changes and rebuild
	@echo "$(GREEN)Watching for changes...$(NC)"
	npm run dev

.PHONY: build-types
build-types: check-deps ## Build only TypeScript declarations
	@echo "$(GREEN)Building TypeScript declarations...$(NC)"
	npm run build:types
	@echo "$(GREEN)✓ TypeScript declarations built$(NC)"

.PHONY: build-bundle
build-bundle: check-deps ## Build only JavaScript bundles
	@echo "$(GREEN)Building JavaScript bundles...$(NC)"
	npm run build:bundle
	@echo "$(GREEN)✓ JavaScript bundles built$(NC)"

.PHONY: build-css
build-css: check-deps ## Build only CSS files
	@echo "$(GREEN)Building CSS files...$(NC)"
	npm run build:css
	@echo "$(GREEN)✓ CSS files built$(NC)"

.PHONY: build-info
build-info: ## Show build information
	@echo ""
	@echo "$(BOLD)Build Information:$(NC)"
	@echo "$(YELLOW)Package:$(NC) $(PACKAGE_NAME) v$(VERSION)"
	@if [ -d "$(DIST_DIR)" ]; then \
		echo "$(YELLOW)Output directory:$(NC) $(DIST_DIR)/"; \
		echo "$(YELLOW)Generated files:$(NC)"; \
		ls -la $(DIST_DIR)/ | awk 'NR>1 {printf "  %s (%s)\n", $$9, $$5}'; \
	fi

# Testing targets
.PHONY: test
test: check-deps ## Run all tests
	@echo "$(GREEN)Running tests...$(NC)"
	npm test

.PHONY: test-watch
test-watch: check-deps ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	npm run test:watch

.PHONY: test-coverage
test-coverage: check-deps ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	npm test -- --coverage
	@if [ -d "$(COVERAGE_DIR)" ]; then \
		echo "$(GREEN)✓ Coverage report generated in $(COVERAGE_DIR)/$(NC)"; \
	fi

# Code quality targets
.PHONY: lint
lint: check-deps ## Run ESLint
	@echo "$(GREEN)Running ESLint...$(NC)"
	npm run lint

.PHONY: lint-fix
lint-fix: check-deps ## Run ESLint with auto-fix
	@echo "$(GREEN)Running ESLint with auto-fix...$(NC)"
	npm run lint -- --fix
	@echo "$(GREEN)✓ Linting completed$(NC)"

.PHONY: format
format: check-deps ## Format code with Prettier
	@echo "$(GREEN)Formatting code with Prettier...$(NC)"
	npm run format
	@echo "$(GREEN)✓ Code formatted$(NC)"

.PHONY: check
check: lint test ## Run all code quality checks
	@echo "$(GREEN)✓ All checks passed$(NC)"

# Cleaning targets
.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	npm run clean
	@echo "$(GREEN)✓ Build artifacts cleaned$(NC)"

.PHONY: clean-all
clean-all: clean ## Clean everything (build artifacts + node_modules)
	@echo "$(YELLOW)Cleaning everything...$(NC)"
	rm -rf $(NODE_MODULES) package-lock.json $(COVERAGE_DIR)
	@echo "$(GREEN)✓ Everything cleaned$(NC)"

.PHONY: clean-cache
clean-cache: ## Clean npm cache
	@echo "$(YELLOW)Cleaning npm cache...$(NC)"
	npm cache clean --force
	@echo "$(GREEN)✓ npm cache cleaned$(NC)"

# Publishing targets
.PHONY: publish-check
publish-check: check-deps build test ## Check if package is ready for publishing
	@echo "$(GREEN)Checking package for publishing...$(NC)"
	npm pack --dry-run
	@echo ""
	@echo "$(YELLOW)Pre-publish checklist:$(NC)"
	@echo "  ✓ Dependencies installed"
	@echo "  ✓ Build completed"
	@echo "  ✓ Tests passed"
	@if [ -f "README.md" ]; then echo "  ✓ README.md exists"; else echo "  $(RED)✗ README.md missing$(NC)"; fi
	@if [ -f "LICENSE" ]; then echo "  ✓ LICENSE exists"; else echo "  $(RED)✗ LICENSE missing$(NC)"; fi
	@echo "$(GREEN)✓ Package ready for publishing$(NC)"

.PHONY: publish-dry
publish-dry: publish-check ## Dry run publish (test without actually publishing)
	@echo "$(GREEN)Running publish dry run...$(NC)"
	npm publish --dry-run --access public
	@echo "$(GREEN)✓ Dry run completed successfully$(NC)"

.PHONY: publish
publish: publish-check ## Publish package to NPM
	@echo "$(YELLOW)Are you sure you want to publish $(PACKAGE_NAME) v$(VERSION)? [y/N]$(NC)"
	@read -r REPLY; \
	if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		echo "$(GREEN)Publishing to NPM...$(NC)"; \
		npm publish --access public; \
		echo "$(GREEN)✓ Successfully published $(PACKAGE_NAME) v$(VERSION)$(NC)"; \
		echo "$(YELLOW)Install with: npm install $(PACKAGE_NAME)$(NC)"; \
		echo "$(YELLOW)CDN: https://unpkg.com/$(PACKAGE_NAME)@latest/dist/time-picker.min.js$(NC)"; \
	else \
		echo "$(YELLOW)Publish cancelled$(NC)"; \
	fi

# Documentation targets
.PHONY: docs
docs: ## Generate documentation
	@echo "$(GREEN)Generating documentation...$(NC)"
	@if [ ! -f "README.md" ]; then \
		echo "$(YELLOW)Creating README.md...$(NC)"; \
		$(MAKE) create-readme; \
	fi
	@if [ ! -f "LICENSE" ]; then \
		echo "$(YELLOW)Creating LICENSE...$(NC)"; \
		$(MAKE) create-license; \
	fi
	@echo "$(GREEN)✓ Documentation ready$(NC)"

.PHONY: create-readme
create-readme: ## Create README.md file
	@echo "# $(PACKAGE_NAME)" > README.md
	@echo "" >> README.md
	@echo "A lightweight, framework-agnostic time picker component for web applications." >> README.md
	@echo "" >> README.md
	@echo "## Installation" >> README.md
	@echo "" >> README.md
	@echo "\`\`\`bash" >> README.md
	@echo "npm install $(PACKAGE_NAME)" >> README.md
	@echo "\`\`\`" >> README.md
	@echo "" >> README.md
	@echo "## Usage" >> README.md
	@echo "" >> README.md
	@echo "\`\`\`javascript" >> README.md
	@echo "import TimePicker from '$(PACKAGE_NAME)';" >> README.md
	@echo "new TimePicker('#time-input', { format: '12h' });" >> README.md
	@echo "\`\`\`" >> README.md
	@echo "$(GREEN)✓ README.md created$(NC)"

.PHONY: create-license
create-license: ## Create MIT LICENSE file
	@echo "MIT License" > LICENSE
	@echo "" >> LICENSE
	@echo "Copyright (c) $$(date +%Y) Parkineo" >> LICENSE
	@echo "" >> LICENSE
	@echo "Permission is hereby granted, free of charge, to any person obtaining a copy" >> LICENSE
	@echo "of this software and associated documentation files (the \"Software\"), to deal" >> LICENSE
	@echo "in the Software without restriction, including without limitation the rights" >> LICENSE
	@echo "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell" >> LICENSE
	@echo "copies of the Software, and to permit persons to whom the Software is" >> LICENSE
	@echo "furnished to do so, subject to the following conditions:" >> LICENSE
	@echo "" >> LICENSE
	@echo "The above copyright notice and this permission notice shall be included in all" >> LICENSE
	@echo "copies or substantial portions of the Software." >> LICENSE
	@echo "" >> LICENSE
	@echo "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR" >> LICENSE
	@echo "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY," >> LICENSE
	@echo "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE" >> LICENSE
	@echo "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER" >> LICENSE
	@echo "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM," >> LICENSE
	@echo "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE" >> LICENSE
	@echo "SOFTWARE." >> LICENSE
	@echo "$(GREEN)✓ LICENSE created$(NC)"

# Utility targets
.PHONY: info
info: ## Show project information
	@echo "$(BOLD)Project Information:$(NC)"
	@echo "$(YELLOW)Name:$(NC) $(PACKAGE_NAME)"
	@echo "$(YELLOW)Version:$(NC) $(VERSION)"
	@echo "$(YELLOW)Node.js:$(NC) $$(node --version)"
	@echo "$(YELLOW)NPM:$(NC) $$(npm --version)"
	@if [ -d "$(NODE_MODULES)" ]; then \
		echo "$(YELLOW)Dependencies:$(NC) Installed"; \
	else \
		echo "$(YELLOW)Dependencies:$(NC) $(RED)Not installed$(NC)"; \
	fi
	@if [ -d "$(DIST_DIR)" ]; then \
		echo "$(YELLOW)Build status:$(NC) Built"; \
	else \
		echo "$(YELLOW)Build status:$(NC) $(RED)Not built$(NC)"; \
	fi

.PHONY: size
size: build ## Show bundle sizes
	@echo "$(BOLD)Bundle Sizes:$(NC)"
	@if [ -f "$(DIST_DIR)/time-picker.js" ]; then \
		echo "$(YELLOW)UMD Bundle:$(NC) $$(du -h $(DIST_DIR)/time-picker.js | cut -f1)"; \
	fi
	@if [ -f "$(DIST_DIR)/time-picker.min.js" ]; then \
		echo "$(YELLOW)UMD Minified:$(NC) $$(du -h $(DIST_DIR)/time-picker.min.js | cut -f1)"; \
	fi
	@if [ -f "$(DIST_DIR)/time-picker.esm.js" ]; then \
		echo "$(YELLOW)ES Module:$(NC) $$(du -h $(DIST_DIR)/time-picker.esm.js | cut -f1)"; \
	fi
	@if [ -f "$(DIST_DIR)/time-picker.css" ]; then \
		echo "$(YELLOW)CSS:$(NC) $$(du -h $(DIST_DIR)/time-picker.css | cut -f1)"; \
	fi
	@if [ -f "$(DIST_DIR)/time-picker.min.css" ]; then \
		echo "$(YELLOW)CSS Minified:$(NC) $$(du -h $(DIST_DIR)/time-picker.min.css | cut -f1)"; \
	fi

.PHONY: outdated
outdated: check-deps ## Check for outdated dependencies
	@echo "$(GREEN)Checking for outdated dependencies...$(NC)"
	npm outdated

.PHONY: audit
audit: check-deps ## Run security audit
	@echo "$(GREEN)Running security audit...$(NC)"
	npm audit

.PHONY: update
update: check-deps ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(NC)"
	npm update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

# Git targets
.PHONY: git-status
git-status: ## Show git status
	@echo "$(BOLD)Git Status:$(NC)"
	@git status --porcelain || echo "$(RED)Not a git repository$(NC)"

.PHONY: git-tag
git-tag: ## Create git tag for current version
	@echo "$(GREEN)Creating git tag v$(VERSION)...$(NC)"
	git commit -am "Release v$(VERSION)"
	git tag v$(VERSION)
	git push origin v$(VERSION)
	git push origin --tags
	@echo "$(GREEN)✓ Tag v$(VERSION) created and pushed$(NC)"

# Release targets
.PHONY: release-patch
release-patch: check lint test build version-patch git-tag publish ## Release patch version
	@echo "$(GREEN)✓ Patch release completed$(NC)"

.PHONY: release-minor
release-minor: check lint test build version-minor git-tag publish ## Release minor version
	@echo "$(GREEN)✓ Minor release completed$(NC)"

.PHONY: release-major
release-major: check lint test build version-major git-tag publish ## Release major version
	@echo "$(GREEN)✓ Major release completed$(NC)"

# Internal utility targets
.PHONY: check-deps
check-deps:
	@if [ ! -d "$(NODE_MODULES)" ]; then \
		echo "$(RED)Dependencies not installed. Run 'make install' first.$(NC)"; \
		exit 1; \
	fi

# Composite targets
.PHONY: setup
setup: install docs ## Initial project setup
	@echo "$(GREEN)✓ Project setup completed$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  make dev     # Start development"
	@echo "  make build   # Build project"
	@echo "  make test    # Run tests"

.PHONY: ci
ci: install lint test build ## Continuous Integration target
	@echo "$(GREEN)✓ CI pipeline completed$(NC)"

.PHONY: all
all: clean install build test lint ## Build everything from scratch
	@echo "$(GREEN)✓ Full build completed$(NC)"

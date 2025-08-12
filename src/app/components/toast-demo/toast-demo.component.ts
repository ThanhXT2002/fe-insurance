import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastPosition, ToastSeverity } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-demo',
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-3xl font-bold mb-6 text-center">Toast Service Demo</h2>

      <!-- Severity Examples -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Toast Severities</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            (click)="showSuccess()"
            class="bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
          >
            Success Toast
          </button>
          <button
            (click)="showInfo()"
            class="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Info Toast
          </button>
          <button
            (click)="showWarn()"
            class="bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600"
          >
            Warn Toast
          </button>
          <button
            (click)="showError()"
            class="bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
          >
            Error Toast
          </button>
          <button
            (click)="showSecondary()"
            class="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
          >
            Secondary Toast
          </button>
          <button
            (click)="showContrast()"
            class="bg-black text-white p-3 rounded-md hover:bg-gray-800"
          >
            Contrast Toast
          </button>
        </div>
      </div>

      <!-- Position Examples -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Toast Positions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            (click)="showTopLeft()"
            class="bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600"
          >
            Top Left
          </button>
          <button
            (click)="showTopCenter()"
            class="bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600"
          >
            Top Center
          </button>
          <button
            (click)="showTopRight()"
            class="bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600"
          >
            Top Right
          </button>
          <button
            (click)="showBottomLeft()"
            class="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600"
          >
            Bottom Left
          </button>
          <button
            (click)="showBottomCenter()"
            class="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600"
          >
            Bottom Center
          </button>
          <button
            (click)="showBottomRight()"
            class="bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600"
          >
            Bottom Right
          </button>
          <button
            (click)="showCenter()"
            class="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 md:col-span-3"
          >
            Center
          </button>
        </div>
      </div>

      <!-- Custom Examples -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Custom Toasts</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            (click)="showCustomTitle()"
            class="bg-teal-500 text-white p-3 rounded-md hover:bg-teal-600"
          >
            Custom Title
          </button>
          <button
            (click)="showSticky()"
            class="bg-yellow-600 text-white p-3 rounded-md hover:bg-yellow-700"
          >
            Sticky Toast
          </button>
          <button
            (click)="showLongLife()"
            class="bg-pink-500 text-white p-3 rounded-md hover:bg-pink-600"
          >
            Long Life (10s)
          </button>
        </div>
      </div>

      <!-- Clear Actions -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Clear Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            (click)="clearTopCenter()"
            class="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
          >
            Clear Top Center
          </button>
          <button
            (click)="clearBottomRight()"
            class="bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
          >
            Clear Bottom Right
          </button>
          <button
            (click)="clearAll()"
            class="bg-red-600 text-white p-3 rounded-md hover:bg-red-700"
          >
            Clear All Toasts
          </button>
        </div>
      </div>

      <!-- Advanced Examples -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Advanced Usage</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            (click)="showMultipleToasts()"
            class="bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700"
          >
            Show Multiple Toasts
          </button>
          <button
            (click)="showFormValidationExample()"
            class="bg-red-700 text-white p-3 rounded-md hover:bg-red-800"
          >
            Form Validation Example
          </button>
        </div>
      </div>

      <!-- Code Examples -->
      <div class="bg-gray-100 p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-2">Code Examples:</h3>
        <pre class="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto"><code>// Basic usage
this.toastService.success('Operation completed successfully!');
this.toastService.error('Something went wrong!');
this.toastService.secondary('Secondary notification');
this.toastService.contrast('High contrast message');

// With custom title and position
this.toastService.info('Data saved', 'Database', 'bottom-right');

// Using show method with options
this.toastService.show(&#123;
  severity: 'warn',
  message: 'Please check your input',
  title: 'Validation Warning',
  position: 'top-left',
  life: 8000
&#125;);

// Sticky toast (doesn't auto-hide)
this.toastService.showSticky(&#123;
  severity: 'info',
  message: 'Important notification',
  position: 'center'
&#125;);</code></pre>
      </div>
    </div>
  `
})
export class ToastDemoComponent {
  private toastService = inject(ToastService);

  // Basic severity examples
  showSuccess() {
    this.toastService.success('Operation completed successfully!');
  }

  showInfo() {
    this.toastService.info('This is an informational message');
  }

  showWarn() {
    this.toastService.warn('Please be careful with this action');
  }

  showError() {
    this.toastService.error('Something went wrong!');
  }

  showSecondary() {
    this.toastService.secondary('This is a secondary message');
  }

  showContrast() {
    this.toastService.contrast('This is a high contrast message');
  }

  // Position examples
  showTopLeft() {
    this.toastService.success('Toast positioned at top-left', undefined, 'top-left');
  }

  showTopCenter() {
    this.toastService.info('Toast positioned at top-center', undefined, 'top-center');
  }

  showTopRight() {
    this.toastService.warn('Toast positioned at top-right', undefined, 'top-right');
  }

  showBottomLeft() {
    this.toastService.error('Toast positioned at bottom-left', undefined, 'bottom-left');
  }

  showBottomCenter() {
    this.toastService.success('Toast positioned at bottom-center', undefined, 'bottom-center');
  }

  showBottomRight() {
    this.toastService.info('Toast positioned at bottom-right', undefined, 'bottom-right');
  }

  showCenter() {
    this.toastService.warn('Toast positioned at center', undefined, 'center');
  }

  // Custom examples
  showCustomTitle() {
    this.toastService.success('User profile updated successfully', 'Profile Update', 'top-right');
  }

  showSticky() {
    this.toastService.showSticky({
      severity: 'info',
      message: 'This toast will not disappear automatically. Click X to close.',
      title: 'Persistent Message',
      position: 'bottom-right'
    });
  }

  showLongLife() {
    this.toastService.show({
      severity: 'warn',
      message: 'This toast will stay for 10 seconds',
      title: 'Long Duration',
      position: 'top-left',
      life: 10000
    });
  }

  // Clear actions
  clearTopCenter() {
    this.toastService.clear('top-center');
  }

  clearBottomRight() {
    this.toastService.clear('bottom-right');
  }

  clearAll() {
    this.toastService.clear();
  }

  // Advanced examples
  showMultipleToasts() {
    this.toastService.success('First toast', 'Step 1', 'top-left');
    setTimeout(() => {
      this.toastService.info('Second toast', 'Step 2', 'top-center');
    }, 500);
    setTimeout(() => {
      this.toastService.warn('Third toast', 'Step 3', 'top-right');
    }, 1000);
  }

  showFormValidationExample() {
    this.toastService.error('Email is required', 'Validation Error', 'bottom-center');
    setTimeout(() => {
      this.toastService.error('Password must be at least 6 characters', 'Validation Error', 'bottom-center');
    }, 200);
  }
}

// Import models to ensure they are registered
import './userModel';
import './blogModel';

// Re-export for convenience
export { User } from './userModel';
export { Blog } from './blogModel'; 
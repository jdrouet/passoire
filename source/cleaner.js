/**
 * class reprensenting a schema manager
 */
class Cleaner {
  /**
   * Create a cleaner instance
   */
  constructor() {
    this.schemas = new Map();
  }

  /**
   * Register a schema by its name
   * @param {string} name - Name of the schema
   * @param {Schema} schema - schema to register
   */
  register(name, schema) {
    this.schemas.set(name, schema);
  }

  /**
   * Clean an item or an array of items with a schema
   * @param {string} schemaName - name of the schema to user
   * @param {Object|Array} input - item to clean
   * @param {string} view - name of the view to use
   * @return {Object|Array} cleaned object
   */
  clean(schemaName, input, view) {
    const schema = this.schemas.get(schemaName);
    if (Array.isArray(input)) {
      return input.map((item) => schema.clean(this, item, view));
    }
    return schema.clean(this, input, view);
  }
}

module.exports = Cleaner;

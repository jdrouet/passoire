/**
 * class reprensenting an entity to clean
 */
class Schema {
  /**
   * Create a schema
   * @param {object} definition - Definition of your model
   */
  constructor(definition) {
    this.definition = definition;
  }

  /**
   * Give the change to apply to the cleaned object
   * @param {Cleaner} cleaner - Cleaner instance
   * @param {string} view - View requested
   * @param {object} field - Description of the field
   * @param {string} key - Key of the object your cleaning
   * @param {any} value - value of the object for that key
   * @return {object} change to apply to the cleaned object
   */
  cleanField(cleaner, view, field, key, value) {
    const canSeeField = !view || !field.views || field.views.includes(view);
    if (!canSeeField) return {};
    if (field.array && !Array.isArray(value)) {
      return {[key]: []};
    }
    if (typeof value === 'undefined') {
      return {[key]: null};
    }
    if (field.schema) {
      return {[key]: cleaner.clean(field.schema, value, view)};
    }
    return {[key]: value};
  }


  /**
   * Give the change to apply to the cleaned object
   * @param {Cleaner} cleaner - Cleaner instance
   * @param {Object} input - Item or list of items to clean
   * @param {string} view - View requested
   * @return {Object} the cleaned object
   */
  clean(cleaner, input, view) {
    return Object.keys(this.definition).reduce((result, key) => {
      const field = this.definition[key];
      const canSeeField = !view || !field.views || field.views.includes(view);
      if (!canSeeField) return result;
      const change = this.cleanField(cleaner, view, field, key, input[key]);
      return Object.assign(result, change);
    }, {});
  }
}

module.exports = Schema;

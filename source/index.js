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
   * @param {string} view - View requested
   * @param {object} field - Description of the field
   * @param {string} key - Key of the object your cleaning
   * @param {any} value - value of the object for that key
   * @return {object} change to apply to the cleaned object
   */
  cleanField(view, field, key, value) {
    const canSeeField = !view || !field.views || field.views.includes(view);
    if (!canSeeField) return {};
    if (field.array) {
      if (!Array.isArray(value)) return {[key]: []};
      if (field.schema) {
        return {[key]: value.map((item) => field.schema.clean(item, view))};
      }
    }
    if (typeof value === 'undefined') {
      return {[key]: null};
    }
    if (field.schema) {
      return {[key]: field.schema.clean(value, view)};
    }
    return {[key]: value};
  }


  /**
   * Give the change to apply to the cleaned object
   * @param {object|array} input - Item or list of items to clean
   * @param {string} view - View requested
   * @return {object} the cleaned object
   */
  clean(input, view) {
    return Object.keys(this.definition).reduce((result, key) => {
      const field = this.definition[key];
      const value = input[key];
      return Object.assign(result, this.cleanField(view, field, key, value));
    }, {});
  }
}

module.exports = Schema;

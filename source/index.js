class Schema {
  constructor(definition) {
    this.definition = definition;
  }

  cleanField(view, result, field, key, value) {
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

  clean(input, view) {
    return Object.keys(this.definition).reduce((result, key) => {
      const field = this.definition[key];
      const value = input[key];
      return Object.assign(result, this.cleanField(view, result, field, key, value));
    }, {});
  }
}

module.exports = Schema;

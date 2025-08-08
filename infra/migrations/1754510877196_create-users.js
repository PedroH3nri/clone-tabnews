exports.up = (pgm) => {
  pgm.createExtension("citext", { ifNotExists: true });

  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    username: {
      type: "citext",
      notNull: true,
      unique: true,
    },

    email: {
      type: "citext",
      notNull: true,
      unique: true,
    },

    // Why 60 in length? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    // Why timestamptz with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });

  // For reference, GitHub limits useranames to 39 characters.
  pgm.addConstraint("users", "username_max_length", {
    check: "char_length(username) <= 30",
  });

  // Why 254 in length? https://stackoverflow.com/a/1199238
  pgm.addConstraint("users", "email_max_length", {
    check: "char_length(email) <= 254",
  });
};

exports.down = false;

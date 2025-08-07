exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference, GitHub limits useranames to 39 characters.
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },

    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Why 72 in length? https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length/39851#39851
    password: {
      type: "varchar(72)",
      notNull: true,
    },

    // Why timestamptz with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;

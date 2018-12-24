namespace CapstoneProject.Data
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DataModel : DbContext
    {
        public DataModel()
            : base("name=DataModel")
        {
        }

        public virtual DbSet<Annotate> Annotates { get; set; }
        public virtual DbSet<Box> Boxes { get; set; }
        public virtual DbSet<Circle> Circles { get; set; }
        public virtual DbSet<Map> Maps { get; set; }
        public virtual DbSet<PolyLine> PolyLines { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(e => e.Maps)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete(false);
        }
    }
}

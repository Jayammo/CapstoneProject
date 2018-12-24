namespace CapstoneProject.Data
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;
    using System.Runtime.Serialization;

    public partial class Map
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Map()
        {
            Annotates = new HashSet<Annotate>();
            Boxes = new HashSet<Box>();
            Circles = new HashSet<Circle>();
            PolyLines = new HashSet<PolyLine>();
        }

        public int Id { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public int UserId { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        public double? Zoom { get; set; }

        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Annotate> Annotates { get; set; }

        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Box> Boxes { get; set; }

        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Circle> Circles { get; set; }

        [JsonIgnore]
        public virtual User User { get; set; }

        [IgnoreDataMember]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PolyLine> PolyLines { get; set; }
    }
}

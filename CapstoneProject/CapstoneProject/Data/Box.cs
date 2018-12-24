namespace CapstoneProject.Data
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Box")]
    public partial class Box
    {
        public int Id { get; set; }

        public double NorthEastLat { get; set; }

        public double NorthEastLng { get; set; }

        public double SouthWestLat { get; set; }

        public double SouthWestLng { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        public int MapId { get; set; }

        [JsonIgnore]
        public virtual Map Map { get; set; }
    }
}

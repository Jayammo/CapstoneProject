namespace CapstoneProject.Data
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;
    using System.Runtime.Serialization;

    [Table("Annotate")]
    public partial class Annotate
    {
        public int Id { get; set; }

        public double Lat { get; set; }

        public double Lng { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(400)]
        public string Description { get; set; }

        public int MapId { get; set; }

        [JsonIgnore]
        public virtual Map Map { get; set; }
    }
}

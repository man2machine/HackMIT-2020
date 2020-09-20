import com.univocity.parsers.annotations.Parsed;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Record {

    @Parsed
    private String safegraph_place_id;

    @Parsed
    private String location_name;

    @Parsed
    private String street_address;

    @Parsed
    private String city;

    @Parsed
    private String region;

    @Parsed
    private String postal_code;

    @Parsed
    private String iso_country_code;

    @Parsed
    private String safegraph_brand_ids;

    @Parsed
    private String brands;

    @Parsed
    private String date_range_start;

    @Parsed
    private String date_range_end;

    @Parsed
    private String raw_visit_counts;

    @Parsed
    private String raw_visitor_counts;

    @Parsed
    private String visits_by_day;

    @Parsed
    private String visits_by_each_hour;

    @Parsed
    private String poi_cbg;

    @Parsed
    private String visitor_home_cbgs;

    @Parsed
    private String visitor_daytime_cbgs;

    @Parsed
    private String visitor_country_of_origin;

    @Parsed
    private String distance_from_home;

    @Parsed
    private String median_dwell;

    @Parsed
    private String bucketed_dwell_times;

    @Parsed
    private String related_same_day_brand;

    @Parsed
    private String related_same_week_brand;

    @Parsed
    private String device_type;

}

import com.univocity.parsers.annotations.Parsed;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class Mapping {

    @Parsed
    private String safegraph_place_id;

    @Parsed
    private String parent_safegraph_place_id;

    @Parsed
    private String location_name;

    @Parsed
    private String safegraph_brand_ids;

    @Parsed
    private String brands;

    @Parsed
    private String top_category;

    @Parsed
    private String sub_category;

    @Parsed
    private String naics_code;

    @Parsed
    private String latitude;

    @Parsed
    private String longitude;

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
    private String phone_number;

    @Parsed
    private String open_hours;

    @Parsed
    private String category_tags;

}

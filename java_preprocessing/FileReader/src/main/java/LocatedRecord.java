import com.univocity.parsers.annotations.Parsed;
import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
public class LocatedRecord {
    @Parsed
    private Record record;

    @Parsed
    private Mapping mapping;

}

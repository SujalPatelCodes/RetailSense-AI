from app.services.data_cleaning import validate_and_clean_csv
import io


def test_cleaning_basic():
    csv_content = b"order_id,order_date,customer_id,product,category,quantity,unit_price\n1,2023-01-01,C001,Widget,A,2,10\n2,2023-01-02,C002,Gadget,B,1,20\n"
    df, summary = validate_and_clean_csv(csv_content)
    assert len(df) == 2
    assert "order_value" in df.columns
    assert "year" in df.columns
    assert "month" in df.columns
    assert summary["rows"] == 2

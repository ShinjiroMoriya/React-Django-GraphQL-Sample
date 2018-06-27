
class Pagination:
    def __init__(self, page: int, per_page: int):
        self.page = int(page)
        self.per_page = per_page
        self.offset = (int(page) - 1) * int(per_page)
